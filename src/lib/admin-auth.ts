const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export const ADMIN_COOKIE = "fullbite-admin";
export { SESSION_MS };

export type AdminUser = {
  email: string;
  password: string;
};

export type AdminSession = {
  email: string;
  expiresAt: number;
};

export function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

export function getAdminUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const sep = entry.indexOf(":");
        if (sep <= 0) return null;
        const email = entry.slice(0, sep).trim().toLowerCase();
        const password = entry.slice(sep + 1);
        if (!email || !password) return null;
        return { email, password };
      })
      .filter((user): user is AdminUser => Boolean(user));
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    return [{ email, password }];
  }

  return [];
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function verifyAdminCredentials(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = getAdminUsers();
  return users.some(
    (user) => user.email === normalized && safeEqual(user.password, password),
  );
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signPayload(payload: string) {
  const secret = sessionSecret();
  if (!secret) return "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(email: string) {
  if (!sessionSecret()) {
    throw new Error("ADMIN_SESSION_SECRET tanımlı değil.");
  }
  const expiresAt = Date.now() + SESSION_MS;
  const payload = `${email.toLowerCase()}|${expiresAt}`;
  const signature = await signPayload(payload);
  return toBase64Url(new TextEncoder().encode(`${payload}|${signature}`));
}

function fromBase64Url(token: string) {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  return new TextDecoder().decode(
    Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)),
  );
}

export async function parseSessionToken(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token || !sessionSecret()) return null;
  try {
    const decoded = fromBase64Url(token);
    const lastSep = decoded.lastIndexOf("|");
    if (lastSep <= 0) return null;
    const payload = decoded.slice(0, lastSep);
    const signature = decoded.slice(lastSep + 1);
    const expected = await signPayload(payload);
    if (!expected || !safeEqual(signature, expected)) return null;

    const emailSep = payload.indexOf("|");
    if (emailSep <= 0) return null;
    const email = payload.slice(0, emailSep);
    const expiresAt = Number(payload.slice(emailSep + 1));
    if (!email || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      return null;
    }

    const allowed = getAdminUsers().some((user) => user.email === email);
    if (!allowed) return null;

    return { email, expiresAt };
  } catch {
    return null;
  }
}

export function adminCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
