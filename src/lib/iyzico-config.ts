import "server-only";

import {
  getIyzicoCredentialSources,
  loadStoredIyzicoCredentials,
  type StoredIyzicoCredentials,
} from "./iyzico-credentials-store";

export type IyzicoEnvStatus = {
  configured: boolean;
  source: "env" | "stored" | null;
  apiKeyName: string | null;
  secretKeyName: string | null;
  baseUrlName: string | null;
  baseUrl: string;
  callbackUrl: string;
  apiKeyPreview: string | null;
  sources: ReturnType<typeof getIyzicoCredentialSources>;
};

export function getPublicBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export async function getIyzicoCredentials(): Promise<StoredIyzicoCredentials | null> {
  return loadStoredIyzicoCredentials();
}

export async function isIyzicoConfigured() {
  const creds = await loadStoredIyzicoCredentials();
  return Boolean(creds?.apiKey && creds?.secretKey);
}

export async function getIyzicoEnvStatus(): Promise<IyzicoEnvStatus> {
  const creds = await loadStoredIyzicoCredentials();
  const sources = getIyzicoCredentialSources();
  const publicBase = getPublicBaseUrl();

  const source: IyzicoEnvStatus["source"] = sources.hasEnvApiKey
    ? "env"
    : creds
      ? "stored"
      : null;

  return {
    configured: Boolean(creds?.apiKey && creds?.secretKey),
    source,
    apiKeyName: sources.hasEnvApiKey ? "IYZI_API_KEY" : creds ? "stored" : null,
    secretKeyName: sources.hasEnvSecret
      ? "IYZI_SECRET_KEY"
      : creds
        ? "stored"
        : null,
    baseUrlName: process.env.IYZI_BASE_URL?.trim() ? "IYZI_BASE_URL" : null,
    baseUrl: creds?.baseUrl || "https://api.iyzipay.com",
    callbackUrl: `${publicBase}/api/iyzico/callback`,
    apiKeyPreview: creds?.apiKey
      ? `${creds.apiKey.slice(0, 6)}…${creds.apiKey.slice(-4)}`
      : null,
    sources,
  };
}

export async function iyzicoConfigErrorMessage() {
  const status = await getIyzicoEnvStatus();
  if (status.configured) return "";

  return "iyzico ödeme ayarları eksik. Vercel'de IYZI_API_KEY ve IYZI_SECRET_KEY değerlerini doldurun veya /yonetim/odeme sayfasından kaydedin.";
}
