import { redisSub } from "../config/redis";
import { db } from "../config/drizzle";
import { liveLocations, workers, specializations } from "../db/schema";
import { sql, eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { io } from "./socket.server";
import { broadcastMonitor } from "../utils/broadcast.monitor";

// Enhanced worker matching with specialization and availability
const getNearbyWorkers = async (
  lat: number,
  lng: number,
  radius: number,
  jobCategory?: string
) => {
  try {
    // Calculate bounding box for efficient querying
    const latDelta = radius / 111.32; // 1 degree = 111.32 km
    const lngDelta = radius / (111.32 * Math.cos((lat * Math.PI) / 180));

    const latMin = lat - latDelta;
    const latMax = lat + latDelta;
    const lngMin = lng - lngDelta;
    const lngMax = lng + lngDelta;

    // Build base query
    let baseConditions = and(
      gte(liveLocations.lat, latMin),
      lte(liveLocations.lat, latMax),
      gte(liveLocations.lng, lngMin),
      lte(liveLocations.lng, lngMax),
      gte(liveLocations.createdAt, new Date(Date.now() - 5 * 60 * 1000)) // 5 minutes ago
    );

    // If job category is specified, add specialization filter
    if (jobCategory) {
      baseConditions = and(
        baseConditions,
        sql`(${specializations.category} = ${jobCategory} OR ${specializations.category} IS NULL)`
      );
    }

    const foundWorkers = await db
      .select({
        id: workers.id,
        firstName: workers.firstName,
        lastName: workers.lastName,
        experienceYears: workers.experienceYears,
        phoneNumber: workers.phoneNumber,
        lat: liveLocations.lat,
        lng: liveLocations.lng,
        lastUpdated: liveLocations.createdAt,
        specialization: specializations.category,
        isPrimary: specializations.isPrimary,
        proficiency: specializations.proficiency,
      })
      .from(workers)
      .innerJoin(liveLocations, eq(workers.id, liveLocations.workerId))
      .leftJoin(specializations, eq(workers.id, specializations.workerId))
      .where(baseConditions)
      .orderBy(
        // Primary specialization first
        desc(specializations.isPrimary),
        // Then higher proficiency
        desc(specializations.proficiency),
        // Then closer distance
        asc(sql`(
          6371 * acos(
            cos(radians(${lat})) * cos(radians(${liveLocations.lat})) *
            cos(radians(${liveLocations.lng}) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(${liveLocations.lat}))
          )
        )`)
      )
      .limit(10);

    // Filter by actual distance and add distance property
    const workersWithDistance = foundWorkers
      .map((worker: any) => ({
        ...worker,
        distance: calculateDistance(lat, lng, worker.lat!, worker.lng!),
      }))
      .filter((worker: any) => worker.distance <= radius)
      .sort((a: any, b: any) => a.distance - b.distance);

    return workersWithDistance;
  } catch (error) {
    console.error("❌ [WORKER_SEARCH] Error in getNearbyWorkers:", error);
    return [];
  }
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
        const { lat, lng, userId, description, id: jobId, specializations: jobSpecializations } = job;

        console.log("📋 [JOB_PROCESSING] Processing job:", {
          jobId,
          description: description?.substring(0, 50) + "...",
          location: { lat, lng },
          userId,
          specializations: jobSpecializations,
        });

        // Extract potential job category from description
        const jobDescription = description.toLowerCase();
        let jobCategory: string | undefined;

        console.log(
          "🔍 [CATEGORY_DETECTION] Analyzing job description for category..."
        );

        // Improved keyword-based category detection
        if (
          jobDescription.includes("plumb") ||
          jobDescription.includes("pipe") ||
          jobDescription.includes("water") ||
          jobDescription.includes("bathroom") ||
          jobDescription.includes("kitchen") ||
          jobDescription.includes("leak") ||
          jobDescription.includes("sink")
        ) {
          jobCategory = "plumber";
        } else if (
          jobDescription.includes("electr") ||
          jobDescription.includes("wire") ||
          jobDescription.includes("switch") ||
          jobDescription.includes("light") ||
          jobDescription.includes("fan")
        ) {
          jobCategory = "electrician";
        } else if (
          jobDescription.includes("carpent") ||
          jobDescription.includes("wood") ||
          jobDescription.includes("furniture") ||
          jobDescription.includes("door") ||
          jobDescription.includes("window")
        ) {
          jobCategory = "carpenter";
        } else if (
          jobDescription.includes("mechanic") ||
          jobDescription.includes("car") ||
          jobDescription.includes("bike") ||
          jobDescription.includes("vehicle") ||
          jobDescription.includes("repair")
        ) {
          jobCategory = "mechanic";
        } else if (
          jobDescription.includes("hair") ||
          jobDescription.includes("salon") ||
          jobDescription.includes("beauty") ||
          jobDescription.includes("treatment") ||
          jobDescription.includes("styling") ||
          jobDescription.includes("grooming")
        ) {
          // Determine if it's men's or women's grooming based on context
          if (
            jobDescription.includes("men") ||
            jobDescription.includes("male")
          ) {
            jobCategory = "mens_grooming";
          } else if (
            jobDescription.includes("women") ||
            jobDescription.includes("female")
          ) {
            jobCategory = "women_grooming";
          } else {
            // Default to mens_grooming if gender is not specified
            jobCategory = "mens_grooming";
          }
        } else {
          // If no specific category found from description, use the job's specializations field
          jobCategory = jobSpecializations;
        }

        console.log(
          "🏷️ [CATEGORY_DETECTION] Detected category:",
          jobCategory || "no specific category"
        );

        // Wait a bit for workers to come online and join their rooms
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(
          "🔍 [WORKER_SEARCH] Starting worker search with progressive radius..."
        );

        // Progressive radius search (5km, 10km, 15km, 20km)
        const searchRadii = [5, 10, 15, 20];
        let foundWorkers: any[] = [];

        for (const radius of searchRadii) {
          console.log(
            `🔍 [WORKER_SEARCH] Searching within ${radius}km radius...`
          );

          try {
            const nearbyWorkers = await getNearbyWorkers(
              lat,
              lng,
              radius,
              jobCategory
            );

            console.log(
              `📊 [WORKER_SEARCH] Found ${nearbyWorkers.length} workers within ${radius}km`
            );

            if (nearbyWorkers.length > 0) {
              foundWorkers = nearbyWorkers;
              break; // Found workers, stop searching
            }
          } catch (error) {
            console.error(
              `❌ [WORKER_SEARCH] Error searching within ${radius}km:`,
              error
            );
          }
        }

        if (foundWorkers.length === 0) {
          console.log(`❌ [WORKER_SEARCH] No workers found for job ${jobId}`);

          // Wait a bit more and try one more time with broader search
          await new Promise((resolve) => setTimeout(resolve, 3000));

          try {
            const nearbyWorkers = await getNearbyWorkers(
              lat,
              lng,
              20,
              jobCategory
            );

            if (nearbyWorkers.length > 0) {
              foundWorkers = nearbyWorkers;
              console.log(
                `📊 [WORKER_SEARCH] Found ${nearbyWorkers.length} workers in final search`
              );
            }
          } catch (error) {
            console.error("❌ [WORKER_SEARCH] Error in final search:", error);
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
          const workerName = `${worker.firstName} ${worker.lastName}`;
          console.log(
            `  ${index + 1}. ${workerName} - ${worker.distance.toFixed(
              2
            )}km away, ${worker.specialization || "no specialization"}`
          );
        });

        // Sort workers by distance (already sorted in getNearbyWorkers)
        console.log("🔄 [WORKER_SORTING] Workers sorted by distance");

        // Limit to top 10 workers to avoid spam
        const topWorkers = foundWorkers.slice(0, 10);
        console.log(
          `📋 [WORKER_SELECTION] Selected top ${topWorkers.length} workers for notification`
        );

        // Broadcast job to nearby workers
        console.log(
          `📤 [SOCKET_EMIT] Broadcasting job to ${topWorkers.length} nearby workers`
        );

        topWorkers.forEach((worker) => {
          const workerName = `${worker.firstName} ${worker.lastName}`;
          console.log(
            `📤 [SOCKET_EMIT] Broadcasting to worker ${worker.id} (${workerName})`
          );

          // Emit job broadcast to specific worker
          io.to(`worker-${worker.id}`).emit("new_job_broadcast", {
            ...job,
            workerDistance: worker.distance,
            workerLocation: { lat: worker.lat, lng: worker.lng },
          });
        });

        // Track successful broadcast
        broadcastMonitor.trackSuccessfulBroadcast(
          jobId,
          topWorkers.length,
          topWorkers.length
        );

        // Notify user about the broadcast
        console.log(
          "📤 [SOCKET_EMIT] Notifying user about successful broadcast"
        );
        io.to(`user-${userId}`).emit("job_status", {
          type: "success",
          message: `Job posted successfully! ${topWorkers.length} workers have been notified.`,
          jobId,
          notifiedWorkers: topWorkers.length,
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

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
