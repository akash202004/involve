import { redisSub } from "../config/redis";
import { db } from "../config/drizzle";
import { liveLocations, workers, specializations } from "../db/schema";
import { sql } from "drizzle-orm";
import { io } from "./socket.server";
import { broadcastMonitor } from "@/utils/broadcast.monitor";

// Enhanced worker matching with specialization and availability
const getNearbyWorkers = async (
  lat: number,
  lng: number,
  radius: number,
  jobCategory?: string
) => {
  let query = sql`
    SELECT DISTINCT 
      w.id as worker_id,
      w."firstName",
      w."lastName",
      w.phone_number,
      w.experience_years,
      ll.lat,
      ll.lng,
      (
        6371 * acos(
          cos(radians(${lat})) *
          cos(radians(ll.lat)) *
          cos(radians(ll.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(ll.lat))
        )
      ) as distance
    FROM workers w
    INNER JOIN live_locations ll ON w.id = ll.worker_id
    WHERE (
      6371 * acos(
        cos(radians(${lat})) *
        cos(radians(ll.lat)) *
        cos(radians(ll.lng) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(ll.lat))
      )
    ) < ${radius}
  `;

  // If job category is specified, filter by specialization
  if (jobCategory) {
    query = sql`
      SELECT DISTINCT 
        w.id as worker_id,
        w."firstName",
        w."lastName",
        w.phone_number,
        w.experience_years,
        ll.lat,
        ll.lng,
        (
          6371 * acos(
            cos(radians(${lat})) *
            cos(radians(ll.lat)) *
            cos(radians(ll.lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(ll.lat))
          )
        ) as distance
      FROM workers w
      INNER JOIN live_locations ll ON w.id = ll.worker_id
      INNER JOIN specializations s ON w.id = s.worker_id
      WHERE (
        6371 * acos(
          cos(radians(${lat})) *
          cos(radians(ll.lat)) *
          cos(radians(ll.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(ll.lat))
        )
      ) < ${radius}
      AND (s.name ILIKE ${`%${jobCategory}%`} OR s.sub_category ILIKE ${`%${jobCategory}%`})
    `;
  }

  const result = await db.execute(query);
  return result.rows as Array<{
    worker_id: string;
    firstName: string;
    lastName: string;
    phone_number: string;
    experience_years: number;
    lat: number;
    lng: number;
    distance: number;
  }>;
};

export const initJobSubscriber = async () => {
  try {
    console.log(
      "🔌 [REDIS_SUBSCRIBER] Initializing Redis subscriber for 'new-job' channel..."
    );

    await redisSub.subscribe("new-job", async (message) => {
      try {
        console.log(
          "📨 [REDIS_SUBSCRIBER] Received message from Redis channel 'new-job'"
        );

        const job = JSON.parse(message);
        const { lat, lng, userId, description, id: jobId } = job;

        console.log("📋 [JOB_PROCESSING] Processing job:", {
          jobId,
          description: description?.substring(0, 50) + "...",
          location: { lat, lng },
          userId,
        });

        // Extract potential job category from description
        const jobDescription = description.toLowerCase();
        let jobCategory: string | undefined;

        console.log(
          "🔍 [CATEGORY_DETECTION] Analyzing job description for category..."
        );

        // Simple keyword-based category detection
        if (
          jobDescription.includes("plumb") ||
          jobDescription.includes("pipe") ||
          jobDescription.includes("water")
        ) {
          jobCategory = "plumber";
        } else if (
          jobDescription.includes("electr") ||
          jobDescription.includes("wire") ||
          jobDescription.includes("switch")
        ) {
          jobCategory = "electrician";
        } else if (
          jobDescription.includes("clean") ||
          jobDescription.includes("housekeeping")
        ) {
          jobCategory = "cleaning";
        } else if (
          jobDescription.includes("carpent") ||
          jobDescription.includes("wood") ||
          jobDescription.includes("furniture")
        ) {
          jobCategory = "carpenter";
        } else if (
          jobDescription.includes("paint") ||
          jobDescription.includes("wall")
        ) {
          jobCategory = "painter";
        } else if (
          jobDescription.includes("ac") ||
          jobDescription.includes("air") ||
          jobDescription.includes("cooling")
        ) {
          jobCategory = "ac_repair";
        }

        console.log(
          "🏷️ [CATEGORY_DETECTION] Detected category:",
          jobCategory || "general"
        );

        const radiusSteps = [5, 10, 15, 20]; // Start with smaller radius for better matching
        let foundWorkers: any[] = [];

        console.log(
          "🔍 [WORKER_SEARCH] Starting worker search with progressive radius..."
        );

        for (const radius of radiusSteps) {
          console.log(
            `🔍 [WORKER_SEARCH] Searching within ${radius}km radius...`
          );

          foundWorkers = await getNearbyWorkers(lat, lng, radius, jobCategory);

          console.log(
            `📊 [WORKER_SEARCH] Found ${foundWorkers.length} workers within ${radius}km`
          );

          if (foundWorkers.length > 0) {
            console.log(
              `✅ [WORKER_SEARCH] Sufficient workers found at ${radius}km radius`
            );
            break;
          }
        }

        if (foundWorkers.length === 0) {
          console.log(`❌ [WORKER_SEARCH] No workers found for job ${jobId}`);
          console.log("📤 [SOCKET_EMIT] Notifying user about no workers found");

          // Track no workers found
          broadcastMonitor.trackNoWorkersFound(jobId);

          io.to(`user-${userId}`).emit("job_status", {
            type: "error",
            message:
              "Sorry, no workers found near your location. Please try again later.",
            jobId,
          });
          return;
        }

        console.log("📊 [WORKER_ANALYSIS] Worker details found:");
        foundWorkers.forEach((worker, index) => {
          console.log(
            `  ${index + 1}. ${worker.firstName} ${
              worker.lastName
            } - ${worker.distance.toFixed(2)}km away, ${
              worker.experience_years
            } years exp`
          );
        });

        // Sort workers by distance and experience
        foundWorkers.sort((a, b) => {
          // Prioritize distance first, then experience
          if (Math.abs(a.distance - b.distance) < 1) {
            return b.experience_years - a.experience_years;
          }
          return a.distance - b.distance;
        });

        console.log(
          "🔄 [WORKER_SORTING] Workers sorted by distance and experience"
        );

        // Limit to top 10 workers to avoid spam
        const topWorkers = foundWorkers.slice(0, 10);
        console.log(
          `📋 [WORKER_SELECTION] Selected top ${topWorkers.length} workers for notification`
        );

        // Broadcast job to nearby workers with enhanced job data
        const enhancedJobData = {
          ...job,
          jobId,
          estimatedDistance: topWorkers[0]?.distance || 0,
          availableWorkers: topWorkers.length,
          category: jobCategory,
        };

        console.log(
          "📡 [SOCKET_BROADCAST] Starting Socket.IO broadcast to workers..."
        );
        console.log("📡 [SOCKET_BROADCAST] Enhanced job data:", {
          jobId,
          category: jobCategory,
          estimatedDistance: enhancedJobData.estimatedDistance,
          availableWorkers: enhancedJobData.availableWorkers,
        });

        let notifiedCount = 0;
        for (const worker of topWorkers) {
          try {
            const workerJobData = {
              ...enhancedJobData,
              workerDistance: worker.distance,
              workerExperience: worker.experience_years,
            };

            console.log(
              `📤 [SOCKET_EMIT] Emitting to worker-${worker.worker_id}:`,
              {
                workerName: `${worker.firstName} ${worker.lastName}`,
                distance: worker.distance.toFixed(2) + "km",
                experience: worker.experience_years + " years",
              }
            );

            io.to(`worker-${worker.worker_id}`).emit(
              "job_request",
              workerJobData
            );
            notifiedCount++;

            console.log(
              `✅ [SOCKET_EMIT] Successfully notified worker ${worker.worker_id}`
            );
          } catch (emitError) {
            console.error(
              `❌ [SOCKET_EMIT] Failed to notify worker ${worker.worker_id}:`,
              emitError
            );
          }
        }

        console.log(
          `🎯 [BROADCAST_SUMMARY] Successfully notified ${notifiedCount}/${topWorkers.length} workers for job ${jobId}`
        );

        // Track successful broadcast
        broadcastMonitor.trackSuccessfulBroadcast(
          jobId,
          foundWorkers.length,
          notifiedCount
        );

        // Notify user about the broadcast
        console.log(
          "📤 [SOCKET_EMIT] Notifying user about successful broadcast"
        );
        io.to(`user-${userId}`).emit("job_status", {
          type: "success",
          message: `Job posted successfully! ${notifiedCount} workers have been notified.`,
          jobId,
          notifiedWorkers: notifiedCount,
        });

        console.log(
          "🎉 [JOB_PROCESSING] Job processing completed successfully"
        );
      } catch (parseError) {
        console.error(
          "❌ [REDIS_SUBSCRIBER] Failed to parse job message:",
          parseError
        );
        console.error("❌ [REDIS_SUBSCRIBER] Raw message:", message);
      }
    });

    console.log(
      "✅ [REDIS_SUBSCRIBER] Successfully subscribed to 'new-job' channel"
    );
  } catch (error) {
    console.error(
      "❌ [REDIS_SUBSCRIBER] Failed to initialize job subscriber:",
      error
    );
  }
};
