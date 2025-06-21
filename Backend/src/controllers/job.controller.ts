import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { jobs } from "@/db/schema";
import { workers } from "@/db/schema";
import { users } from "@/db/schema";
import { jobSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { parse } from "dotenv";
import { ZodError } from "zod";
import {
  redisPub,
  isRedisConnected,
  ensureRedisConnection,
} from "@/config/redis";
import { sql } from "drizzle-orm";
import { broadcastMonitor } from "@/utils/broadcast.monitor";

export const createJob = async (req: Request, res: Response) => {
  try {
    console.log("🔄 [JOB_CREATION] Starting job creation process...");
    console.log(
      "📝 [JOB_CREATION] Request body:",
      JSON.stringify(req.body, null, 2)
    );

    const parsedData = jobSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    console.log("✅ [JOB_CREATION] Data validation passed");
    console.log("📍 [JOB_CREATION] Job location:", {
      lat: parsedData.lat,
      lng: parsedData.lng,
    });

    // Verify that the user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedData.userId));

    if (existingUser.length === 0) {
      console.log("❌ [JOB_CREATION] User not found:", parsedData.userId);
      res.status(404).json({ error: "User not found" });
      return;
    }

    console.log("✅ [JOB_CREATION] User verified:", existingUser[0].email);

    // Convert bookedFor string to Date object
    const jobData = {
      ...parsedData,
      bookedFor: parsedData.bookedFor ? new Date(parsedData.bookedFor) : null,
    };

    console.log("💾 [JOB_CREATION] Inserting job into database...");

    // Create the job
    const newJob = await db.insert(jobs).values(jobData).returning();
    const createdJob = newJob[0];

    console.log(
      "✅ [JOB_CREATION] Job created successfully with ID:",
      createdJob.id
    );

    // Track job creation in monitor
    broadcastMonitor.trackJobCreation(createdJob.id);

    // Broadcast the job to nearby workers through Redis pub/sub
    try {
      // Ensure Redis connection is active
      if (!isRedisConnected()) {
        console.log(
          "🔄 [REDIS] Redis not connected, attempting to reconnect..."
        );
        await ensureRedisConnection();
      }

      if (!isRedisConnected()) {
        throw new Error("Failed to establish Redis connection");
      }

      const broadcastData = {
        ...createdJob,
        userId: parsedData.userId,
        lat: parsedData.lat,
        lng: parsedData.lng,
      };

      console.log("📡 [REDIS_PUBLISH] Publishing to Redis channel 'new-job'");
      console.log(
        "📡 [REDIS_PUBLISH] Broadcast data:",
        JSON.stringify(broadcastData, null, 2)
      );

      await redisPub.publish("new-job", JSON.stringify(broadcastData));

      console.log("✅ [REDIS_PUBLISH] Successfully published job to Redis");
      console.log("🎯 [BROADCAST] Job broadcasted to nearby workers");
    } catch (broadcastError) {
      console.error(
        "❌ [REDIS_PUBLISH] Failed to broadcast job:",
        broadcastError
      );
      console.log(
        "⚠️ [JOB_CREATION] Continuing job creation despite broadcast failure"
      );

      // Track failed broadcast
      broadcastMonitor.trackFailedBroadcast(createdJob.id, broadcastError);
    }

    console.log(
      "🎉 [JOB_CREATION] Job creation process completed successfully"
    );

    res.status(201).json({
      message: "Job created successfully",
      data: createdJob,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error("❌ [JOB_CREATION] Validation error:", error.errors);
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res
        .status(400)
        .json({ message: "Validation failed", errors: formattedErrors });
      return;
    }

    console.error("❌ [JOB_CREATION] Unhandled error:", error);
    res.status(500).json({
      error: error?.message || "Failed to create job",
    });
    return;
  }
};

// ✅ Get All Orders
export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const allJobs = await db.select().from(jobs);
    res.status(200).json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
    return;
  }
};

// ✅ Get Order By ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await db.select().from(jobs).where(eq(jobs.id, id));

    if (!order.length) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.status(200).json(order[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get job" });
    return;
  }
};

//  Update Order Status
export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ] as const;

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid job status" });
      return;
    }

    const updated = await db
      .update(jobs)
      .set({ status })
      .where(eq(jobs.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Job status updated", data: updated[0] });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res
        .status(400)
        .json({ message: "Validation failed", errors: formattedErrors });
      return;
    }
    res.status(400).json({ error: "Failed to update job status" });
    return;
  }
};

// ✅ Delete Order
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db.delete(jobs).where(eq(jobs.id, id)).returning();

    if (!deleted.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Job deleted", data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
    return;
  }
};

// ✅ Get nearby workers for testing
export const getNearbyWorkers = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 10, category } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ error: "Latitude and longitude are required" });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);

    // Use the same logic as the job subscriber
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
            cos(radians(${latitude})) *
            cos(radians(ll.lat)) *
            cos(radians(ll.lng) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(ll.lat))
          )
        ) as distance
      FROM workers w
      INNER JOIN live_locations ll ON w.id = ll.worker_id
      WHERE (
        6371 * acos(
          cos(radians(${latitude})) *
          cos(radians(ll.lat)) *
          cos(radians(ll.lng) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(ll.lat))
        )
      ) < ${radiusKm}
    `;

    if (category) {
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
              cos(radians(${latitude})) *
              cos(radians(ll.lat)) *
              cos(radians(ll.lng) - radians(${longitude})) +
              sin(radians(${latitude})) * sin(radians(ll.lat))
            )
          ) as distance
        FROM workers w
        INNER JOIN live_locations ll ON w.id = ll.worker_id
        INNER JOIN specializations s ON w.id = s.worker_id
        WHERE (
          6371 * acos(
            cos(radians(${latitude})) *
            cos(radians(ll.lat)) *
            cos(radians(ll.lng) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(ll.lat))
          )
        ) < ${radiusKm}
        AND (s.name ILIKE ${`%${category}%`} OR s.sub_category ILIKE ${`%${category}%`})
      `;
    }

    query = sql`${query} ORDER BY distance ASC LIMIT 20`;

    const result = await db.execute(query);

    res.status(200).json({
      workers: result.rows,
      total: result.rows.length,
      searchParams: {
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        category,
      },
    });
  } catch (error) {
    console.error("Error getting nearby workers:", error);
    res.status(500).json({ error: "Failed to get nearby workers" });
  }
};

// ✅ Get job statistics
export const getJobStats = async (_req: Request, res: Response) => {
  try {
    const stats = await db.execute(
      sql.raw(`
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs 
      GROUP BY status
    `)
    );

    const totalJobs = await db.execute(
      sql.raw(`
      SELECT COUNT(*) as total FROM jobs
    `)
    );

    res.status(200).json({
      stats: stats.rows,
      total: totalJobs.rows[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error getting job stats:", error);
    res.status(500).json({ error: "Failed to get job statistics" });
  }
};

// ✅ Get broadcast metrics
export const getBroadcastMetrics = async (_req: Request, res: Response) => {
  try {
    const metrics = broadcastMonitor.getMetrics();
    res.status(200).json({
      message: "Broadcast metrics retrieved successfully",
      data: metrics,
    });
  } catch (error) {
    console.error("Error getting broadcast metrics:", error);
    res.status(500).json({ error: "Failed to get broadcast metrics" });
  }
};

// ✅ Reset broadcast metrics
export const resetBroadcastMetrics = async (_req: Request, res: Response) => {
  try {
    broadcastMonitor.reset();
    res.status(200).json({
      message: "Broadcast metrics reset successfully",
    });
  } catch (error) {
    console.error("Error resetting broadcast metrics:", error);
    res.status(500).json({ error: "Failed to reset broadcast metrics" });
  }
};

// ✅ Health check endpoint
export const healthCheck = async (_req: Request, res: Response) => {
  try {
    const redisStatus = isRedisConnected();
    const dbStatus = await testDatabaseConnection();

    const health = {
      status: redisStatus && dbStatus ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        redis: {
          status: redisStatus ? "connected" : "disconnected",
          details: redisStatus
            ? "Redis connection is active"
            : "Redis connection failed",
        },
        database: {
          status: dbStatus ? "connected" : "disconnected",
          details: dbStatus
            ? "Database connection is active"
            : "Database connection failed",
        },
      },
    };

    const statusCode = health.status === "healthy" ? 200 : 503;

    res.status(statusCode).json({
      message: `System is ${health.status}`,
      data: health,
    });
  } catch (error) {
    console.error("❌ [HEALTH_CHECK] Error:", error);
    res.status(503).json({
      message: "System is unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to test database connection
async function testDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error("❌ [DB_HEALTH] Database connection test failed:", error);
    return false;
  }
}
