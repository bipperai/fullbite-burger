/**
 * Statik process.env referansları — Next.js/Vercel build sırasında
 * dinamik process.env[name] okumasını optimize edip boş bırakabiliyor.
 */
function pickEnv(
  entries: Array<{ name: string; value: string | undefined }>,
) {
  for (const entry of entries) {
    const value = entry.value?.trim();
    if (value) return { name: entry.name, value };
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
  const apiKey = pickEnv([
    { name: "IYZI_API_KEY", value: process.env.IYZI_API_KEY },
    { name: "IYZICO_API_KEY", value: process.env.IYZICO_API_KEY },
    { name: "IYZIPAY_API_KEY", value: process.env.IYZIPAY_API_KEY },
  ]);

  const secretKey = pickEnv([
    { name: "IYZI_SECRET_KEY", value: process.env.IYZI_SECRET_KEY },
    { name: "IYZICO_SECRET_KEY", value: process.env.IYZICO_SECRET_KEY },
    { name: "IYZIPAY_SECRET_KEY", value: process.env.IYZIPAY_SECRET_KEY },
  ]);

  const baseUrlEntry = pickEnv([
    { name: "IYZI_BASE_URL", value: process.env.IYZI_BASE_URL },
    { name: "IYZICO_BASE_URL", value: process.env.IYZICO_BASE_URL },
  ]);

  const baseUrl = baseUrlEntry?.value || "https://sandbox-api.iyzipay.com";

  return {
    apiKey: apiKey?.value ?? null,
    secretKey: secretKey?.value ?? null,
    apiKeyName: apiKey?.name ?? null,
    secretKeyName: secretKey?.name ?? null,
    baseUrlName: baseUrlEntry?.name ?? null,
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
  const publicBase = getPublicBaseUrl();

  return {
    configured: Boolean(creds.apiKey && creds.secretKey),
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
  const status = getIyzicoEnvStatus();
  const missing: string[] = [];

  if (!status.apiKeyName) missing.push("IYZI_API_KEY");
  if (!status.secretKeyName) missing.push("IYZI_SECRET_KEY");

  if (missing.length === 0) {
    return "iyzico yapılandırması okunamadı.";
  }

  return `iyzico anahtarları eksik (${missing.join(", ")}). Vercel Production ortam değişkenlerini kontrol edin.`;
}
