import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    client = null;
    return client;
  }

  client = new Redis({ url, token });
  return client;
}

export function hasRedis() {
  return getRedis() !== null;
}
