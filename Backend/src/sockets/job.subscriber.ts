import { redisSub } from "../config/redis";
import { db } from "../config/drizzle";
import { liveLocations } from "../db/schema";
import { sql } from "drizzle-orm";
import { io } from "./socket.server";

// Haversine SQL distance (Earth radius 6371 km)
const getNearbyWorkers = async (lat: number, lng: number, radius: number) => {
  const result = await db.execute(sql`
    SELECT worker_id FROM ${liveLocations}
    WHERE (
      6371 * acos(
        cos(radians(${lat})) *
        cos(radians(lat)) *
        cos(radians(lng) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(lat))
      )
    ) < ${radius}
  `);
  return result.rows as { worker_id: string }[];
};

export const initJobSubscriber = async () => {
  await redisSub.subscribe("new-job", async (message) => {
    const job = JSON.parse(message);
    const { lat, lng, userId } = job;

    const radiusSteps = [10, 15, 20]; // in km
    let foundWorkers: { worker_id: string }[] = [];

    for (const radius of radiusSteps) {
      foundWorkers = await getNearbyWorkers(lat, lng, radius);
      if (foundWorkers.length > 0) {
        console.log(`Found ${foundWorkers.length} workers within ${radius}km`);
        break;
      }
    }

    if (foundWorkers.length === 0) {
      io.to(`user-${userId}`).emit("job_status", {
        type: "error",
        message: "Sorry, no workers found near your location.",
      });
      return;
    }

    // Broadcast job to nearby workers
    for (const { worker_id } of foundWorkers) {
      io.to(`worker-${worker_id}`).emit("job_request", job);
    }
  });
};
