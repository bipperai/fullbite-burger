import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type StoredIyzicoCredentials = {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
};

const TMP_PATH = "/tmp/fullbite-iyzico.json";
const DATA_PATH = path.join(process.cwd(), ".data", "iyzico-credentials.json");

let memoryCache: StoredIyzicoCredentials | null = null;

function parseCredentials(raw: string): StoredIyzicoCredentials | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(trimmed) as {
        apiKey?: string;
        secretKey?: string;
        baseUrl?: string;
      };
      const apiKey = json.apiKey?.trim();
      const secretKey = json.secretKey?.trim();
      if (!apiKey || !secretKey) return null;
      return {
        apiKey,
        secretKey,
        baseUrl: json.baseUrl?.trim() || "https://api.iyzipay.com",
      };
    } catch {
      return null;
    }
  }

  const parts = trimmed.split("|").map((part) => part.trim());
  if (parts.length < 2 || !parts[0] || !parts[1]) return null;
  return {
    apiKey: parts[0],
    secretKey: parts[1],
    baseUrl: parts[2] || "https://api.iyzipay.com",
  };
}

function fromEnv(): StoredIyzicoCredentials | null {
  const apiKey =
    process.env.IYZI_API_KEY?.trim() ||
    process.env.IYZICO_API_KEY?.trim() ||
    process.env.IYZIPAY_API_KEY?.trim();
  const secretKey =
    process.env.IYZI_SECRET_KEY?.trim() ||
    process.env.IYZICO_SECRET_KEY?.trim() ||
    process.env.IYZIPAY_SECRET_KEY?.trim();

  if (apiKey && secretKey) {
    return {
      apiKey,
      secretKey,
      baseUrl:
        process.env.IYZI_BASE_URL?.trim() ||
        process.env.IYZICO_BASE_URL?.trim() ||
        "https://api.iyzipay.com",
    };
  }

  const combined = process.env.IYZI_CREDENTIALS?.trim();
  if (combined) return parseCredentials(combined);

  const configJson = process.env.IYZI_CONFIG?.trim();
  if (configJson) return parseCredentials(configJson);

  return null;
}

async function readFileIfExists(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    return parseCredentials(raw);
  } catch {
    return null;
  }
}

export async function loadStoredIyzicoCredentials(): Promise<StoredIyzicoCredentials | null> {
  const fromEnvironment = fromEnv();
  if (fromEnvironment) return fromEnvironment;

  if (memoryCache) return memoryCache;

  const tmp = await readFileIfExists(TMP_PATH);
  if (tmp) {
    memoryCache = tmp;
    return tmp;
  }

  const data = await readFileIfExists(DATA_PATH);
  if (data) {
    memoryCache = data;
    return data;
  }

  return null;
}

export function loadIyzicoCredentialsSync(): StoredIyzicoCredentials | null {
  const fromEnvironment = fromEnv();
  if (fromEnvironment) return fromEnvironment;
  return memoryCache;
}

export async function saveIyzicoCredentials(credentials: StoredIyzicoCredentials) {
  memoryCache = credentials;
  const payload = JSON.stringify(credentials, null, 2);

  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, payload, "utf8");

  try {
    await writeFile(TMP_PATH, payload, "utf8");
  } catch {
    // /tmp may be unavailable locally — ignore
  }
}

export function getIyzicoCredentialSources() {
  return {
    hasEnvApiKey: Boolean(
      process.env.IYZI_API_KEY?.trim() ||
        process.env.IYZICO_API_KEY?.trim() ||
        process.env.IYZIPAY_API_KEY?.trim(),
    ),
    hasEnvSecret: Boolean(
      process.env.IYZI_SECRET_KEY?.trim() ||
        process.env.IYZICO_SECRET_KEY?.trim() ||
        process.env.IYZIPAY_SECRET_KEY?.trim(),
    ),
    hasCombinedEnv: Boolean(
      process.env.IYZI_CREDENTIALS?.trim() || process.env.IYZI_CONFIG?.trim(),
    ),
    hasMemoryCache: Boolean(memoryCache),
  };
}
