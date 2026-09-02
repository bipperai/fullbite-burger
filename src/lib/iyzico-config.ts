const API_KEY_NAMES = [
  "IYZI_API_KEY",
  "IYZICO_API_KEY",
  "IYZIPAY_API_KEY",
] as const;

const SECRET_KEY_NAMES = [
  "IYZI_SECRET_KEY",
  "IYZICO_SECRET_KEY",
  "IYZIPAY_SECRET_KEY",
] as const;

const BASE_URL_NAMES = ["IYZI_BASE_URL", "IYZICO_BASE_URL"] as const;

function readEnv(names: readonly string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return { name, value };
  }
  return null;
}

export type IyzicoEnvStatus = {
  configured: boolean;
  apiKeyName: string | null;
  secretKeyName: string | null;
  baseUrlName: string | null;
  baseUrl: string;
  callbackUrl: string;
  apiKeyPreview: string | null;
};

export function getIyzicoCredentials() {
  const apiKey = readEnv(API_KEY_NAMES);
  const secretKey = readEnv(SECRET_KEY_NAMES);
  const baseUrl =
    readEnv(BASE_URL_NAMES)?.value || "https://sandbox-api.iyzipay.com";

  return {
    apiKey: apiKey?.value ?? null,
    secretKey: secretKey?.value ?? null,
    apiKeyName: apiKey?.name ?? null,
    secretKeyName: secretKey?.name ?? null,
    baseUrlName: readEnv(BASE_URL_NAMES)?.name ?? null,
    baseUrl,
  };
}

export function isIyzicoConfigured() {
  const { apiKey, secretKey } = getIyzicoCredentials();
  return Boolean(apiKey && secretKey);
}

export function getPublicBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export function getIyzicoEnvStatus(): IyzicoEnvStatus {
  const creds = getIyzicoCredentials();
  const baseUrl = creds.baseUrl;
  const publicBase = getPublicBaseUrl();

  return {
    configured: Boolean(creds.apiKey && creds.secretKey),
    apiKeyName: creds.apiKeyName,
    secretKeyName: creds.secretKeyName,
    baseUrlName: creds.baseUrlName,
    baseUrl,
    callbackUrl: `${publicBase}/api/iyzico/callback`,
    apiKeyPreview: creds.apiKey
      ? `${creds.apiKey.slice(0, 6)}…${creds.apiKey.slice(-4)}`
      : null,
  };
}

export function iyzicoConfigErrorMessage() {
  const status = getIyzicoEnvStatus();
  const missing: string[] = [];

  if (!status.apiKeyName) {
    missing.push("IYZI_API_KEY");
  }
  if (!status.secretKeyName) {
    missing.push("IYZI_SECRET_KEY");
  }

  if (missing.length === 0) {
    return "iyzico yapılandırması okunamadı.";
  }

  const isVercel = Boolean(process.env.VERCEL);
  const where = isVercel
    ? "Vercel → Project → Settings → Environment Variables (Production) ekleyin ve Redeploy yapın"
    : ".env.local dosyasına ekleyin ve `npm run dev` yeniden başlatın";

  return `iyzico anahtarları eksik (${missing.join(", ")}). ${where}.`;
}
