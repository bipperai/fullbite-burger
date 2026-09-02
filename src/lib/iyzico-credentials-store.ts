import { execSync } from "node:child_process";
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

function trim(value: string | undefined) {
  return value?.trim() || "";
}

/** Next.js build bazen process.env'i boş inline eder; shell env hâlâ dolu olabilir. */
function readShellEnv(name: string) {
  try {
    return trim(execSync(`printenv ${name}`, { encoding: "utf8" }));
  } catch {
    return "";
  }
}

function readEnvValue(name: string) {
  return trim(process.env[name]) || readShellEnv(name);
}

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
      const apiKey = trim(json.apiKey);
      const secretKey = trim(json.secretKey);
      if (!apiKey || !secretKey) return null;
      return {
        apiKey,
        secretKey,
        baseUrl: trim(json.baseUrl) || "https://api.iyzipay.com",
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
    readEnvValue("IYZI_API_KEY") ||
    readEnvValue("IYZICO_API_KEY") ||
    readEnvValue("IYZIPAY_API_KEY");
  const secretKey =
    readEnvValue("IYZI_SECRET_KEY") ||
    readEnvValue("IYZICO_SECRET_KEY") ||
    readEnvValue("IYZIPAY_SECRET_KEY");

  if (apiKey && secretKey) {
    return {
      apiKey,
      secretKey,
      baseUrl:
        readEnvValue("IYZI_BASE_URL") ||
        readEnvValue("IYZICO_BASE_URL") ||
        "https://api.iyzipay.com",
    };
  }

  const combined = readEnvValue("IYZI_CREDENTIALS") || readEnvValue("IYZI_CONFIG");
  if (combined) return parseCredentials(combined);

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

export function probeIyzicoEnv() {
  const names = [
    "IYZI_API_KEY",
    "IYZI_SECRET_KEY",
    "IYZI_BASE_URL",
    "IYZI_CREDENTIALS",
    "IYZICO_API_KEY",
    "ADMIN_USERS",
    "VERCEL",
  ];

  return names.map((name) => ({
    name,
    processEnv: Boolean(process.env[name]?.trim()),
    shellEnv: Boolean(readShellEnv(name)),
  }));
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

export async function saveIyzicoCredentials(credentials: StoredIyzicoCredentials) {
  memoryCache = credentials;
  const payload = JSON.stringify(credentials, null, 2);

  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, payload, "utf8");

  try {
    await writeFile(TMP_PATH, payload, "utf8");
  } catch {
    // ignore
  }
}

export function getIyzicoCredentialSources() {
  return {
    hasEnvApiKey: Boolean(
      readEnvValue("IYZI_API_KEY") ||
        readEnvValue("IYZICO_API_KEY") ||
        readEnvValue("IYZIPAY_API_KEY"),
    ),
    hasEnvSecret: Boolean(
      readEnvValue("IYZI_SECRET_KEY") ||
        readEnvValue("IYZICO_SECRET_KEY") ||
        readEnvValue("IYZIPAY_SECRET_KEY"),
    ),
    hasCombinedEnv: Boolean(
      readEnvValue("IYZI_CREDENTIALS") || readEnvValue("IYZI_CONFIG"),
    ),
    hasMemoryCache: Boolean(memoryCache),
  };
}
