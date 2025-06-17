import { sendNotification } from "@/jobs/sendNotification";
import { Job, Worker } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL!);

export const notificationWorker = new Worker(
  "notifications",
  async (job: Job) => {
    const { type, data } = job.data;

    await sendNotification(type, data);
  },
  { connection: redisConnection }
);

notificationWorker.on("completed", (job: Job) => {
  console.log(`Notification job ${job.id} completed successfully.`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
