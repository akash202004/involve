// src/config/redis.ts
import { createClient } from "redis";

export const redisPub = createClient();
export const redisSub = createClient();

export async function connectRedis() {
  try {
    await redisPub.connect();
    await redisSub.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
}
