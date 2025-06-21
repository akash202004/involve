import { createClient } from "redis";

export const redisPub = createClient({
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ [REDIS] Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      console.log(`🔄 [REDIS] Attempting to reconnect... (attempt ${retries})`);
      return Math.min(retries * 100, 3000);
    },
  },
});

export const redisSub = createClient({
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ [REDIS] Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      console.log(`🔄 [REDIS] Attempting to reconnect... (attempt ${retries})`);
      return Math.min(retries * 100, 3000);
    },
  },
});

let isConnected = false;

export async function connectRedis() {
  try {
    console.log("🔌 [REDIS] Connecting to Redis...");

    // Connect both clients
    await Promise.all([redisPub.connect(), redisSub.connect()]);

    isConnected = true;
    console.log("✅ [REDIS] Successfully connected to Redis");

    // Set up error handlers
    redisPub.on("error", (err) => {
      console.error("❌ [REDIS_PUB] Error:", err);
      isConnected = false;
    });

    redisSub.on("error", (err) => {
      console.error("❌ [REDIS_SUB] Error:", err);
      isConnected = false;
    });

    redisPub.on("connect", () => {
      console.log("✅ [REDIS_PUB] Connected");
      isConnected = true;
    });

    redisSub.on("connect", () => {
      console.log("✅ [REDIS_SUB] Connected");
      isConnected = true;
    });

    redisPub.on("disconnect", () => {
      console.log("🔌 [REDIS_PUB] Disconnected");
      isConnected = false;
    });

    redisSub.on("disconnect", () => {
      console.log("🔌 [REDIS_SUB] Disconnected");
      isConnected = false;
    });
  } catch (err) {
    console.error("❌ [REDIS] Connection error:", err);
    isConnected = false;
    throw err;
  }
}

export function isRedisConnected(): boolean {
  return isConnected && redisPub.isOpen && redisSub.isOpen;
}

export async function ensureRedisConnection() {
  if (!isRedisConnected()) {
    console.log("🔄 [REDIS] Reconnecting to Redis...");
    await connectRedis();
  }
}
