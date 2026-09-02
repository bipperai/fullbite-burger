import "server-only";

function trim(value: string | undefined) {
  return value?.trim() || "";
}

/** Getter'lar build zamanında inline edilmez — Vercel runtime'da okunur. */
export const serverSecrets = {
  get iyziApiKey() {
    return (
      trim(process.env.IYZI_API_KEY) ||
      trim(process.env.IYZICO_API_KEY) ||
      trim(process.env.IYZIPAY_API_KEY)
    );
  },
  get iyziSecretKey() {
    return (
      trim(process.env.IYZI_SECRET_KEY) ||
      trim(process.env.IYZICO_SECRET_KEY) ||
      trim(process.env.IYZIPAY_SECRET_KEY)
    );
  },
  get iyziBaseUrl() {
    return (
      trim(process.env.IYZI_BASE_URL) ||
      trim(process.env.IYZICO_BASE_URL) ||
      "https://sandbox-api.iyzipay.com"
    );
  },
  get publicBaseUrl() {
    const explicit = trim(process.env.NEXT_PUBLIC_BASE_URL);
    if (explicit) return explicit.replace(/\/$/, "");
    const vercel = trim(process.env.VERCEL_URL);
    if (vercel) return `https://${vercel}`;
    return "http://localhost:3000";
  },
};

export function getIyzicoCredentials() {
  const apiKey = serverSecrets.iyziApiKey;
  const secretKey = serverSecrets.iyziSecretKey;

  return {
    apiKey: apiKey || null,
    secretKey: secretKey || null,
    apiKeyName: apiKey
      ? process.env.IYZI_API_KEY?.trim()
        ? "IYZI_API_KEY"
        : process.env.IYZICO_API_KEY?.trim()
          ? "IYZICO_API_KEY"
          : "IYZIPAY_API_KEY"
      : null,
    secretKeyName: secretKey
      ? process.env.IYZI_SECRET_KEY?.trim()
        ? "IYZI_SECRET_KEY"
        : process.env.IYZICO_SECRET_KEY?.trim()
          ? "IYZICO_SECRET_KEY"
          : "IYZIPAY_SECRET_KEY"
      : null,
    baseUrlName: process.env.IYZI_BASE_URL?.trim()
      ? "IYZI_BASE_URL"
      : process.env.IYZICO_BASE_URL?.trim()
        ? "IYZICO_BASE_URL"
        : null,
    baseUrl: serverSecrets.iyziBaseUrl,
  };
}

export function isIyzicoConfigured() {
  return Boolean(serverSecrets.iyziApiKey && serverSecrets.iyziSecretKey);
}

export function getPublicBaseUrl() {
  return serverSecrets.publicBaseUrl;
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

export function getIyzicoEnvStatus(): IyzicoEnvStatus {
  const creds = getIyzicoCredentials();
  const publicBase = getPublicBaseUrl();

  return {
    configured: isIyzicoConfigured(),
    apiKeyName: creds.apiKeyName,
    secretKeyName: creds.secretKeyName,
    baseUrlName: creds.baseUrlName,
    baseUrl: creds.baseUrl,
    callbackUrl: `${publicBase}/api/iyzico/callback`,
    apiKeyPreview: creds.apiKey
      ? `${creds.apiKey.slice(0, 6)}…${creds.apiKey.slice(-4)}`
      : null,
  };
}

export function iyzicoConfigErrorMessage() {
  const missing: string[] = [];
  if (!serverSecrets.iyziApiKey) missing.push("IYZI_API_KEY");
  if (!serverSecrets.iyziSecretKey) missing.push("IYZI_SECRET_KEY");

  if (missing.length === 0) {
    return "iyzico yapılandırması okunamadı.";
  }

  return `iyzico anahtarları eksik (${missing.join(", ")}). Vercel Production ortam değişkenlerini kontrol edin.`;
}
