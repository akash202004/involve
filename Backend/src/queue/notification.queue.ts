import { Queue } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL!);

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,
});
