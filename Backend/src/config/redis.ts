import { createClient } from "redis";

export const redisPub = createClient();
export const redisSub = createClient();

export async function connectRedis() {
  await redisPub.connect();
  await redisSub.connect();
}
