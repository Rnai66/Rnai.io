import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Generates a stable hash for any input object/string
 */
export function generateInputHash(input: any): string {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Gets a cached result from Redis
 */
export async function getCachedResult<T>(skill: string, hash: string): Promise<T | null> {
  try {
    const result = await redis.get(`cache:${skill}:${hash}`);
    return result as T | null;
  } catch (err) {
    console.error("Cache get error:", err);
    return null;
  }
}

/**
 * Sets a cached result in Redis with 24h expiration
 */
export async function setCachedResult(skill: string, hash: string, result: any, ttl: number = 86400): Promise<void> {
  try {
    await redis.set(`cache:${skill}:${hash}`, result, { ex: ttl });
  } catch (err) {
    console.error("Cache set error:", err);
  }
}
