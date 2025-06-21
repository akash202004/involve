import { db } from "../config/drizzle";
import { jobs, workers, liveLocations } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { io } from "./socket.server";

interface AcceptJobPayload {
  jobId: string;
  workerId: string;
}

interface DeclineJobPayload {
  jobId: string;
  workerId: string;
  reason?: string;
}

interface UpdateLocationPayload {
  jobId: string;
  workerId: string;
  lat: number;
  lng: number;
}

// Store active job tracking sessions
const activeJobTracking = new Map<
  string,
  {
    jobId: string;
    workerId: string;
    userId: string;
    socketId: string;
    lastUpdate: Date;
  }
>();

export const registerJobSocketHandlers = (socket: any) => {
  console.log(
    "🔌 [SOCKET_HANDLER] Registering job socket handlers for socket:",
    socket.id
  );

  socket.on("accept_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("🤝 [JOB_ACCEPT] Worker attempting to accept job:", {
      jobId,
      workerId,
    });

    try {
      // Check if job is still available
      const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

      if (!job) {
        console.log("❌ [JOB_ACCEPT] Job not found:", jobId);
        socket.emit("job_error", { message: "Job not found" });
        return;
      }

      console.log("📋 [JOB_ACCEPT] Job found:", {
        jobId,
        status: job.status,
        currentWorkerId: job.workerId,
      });

      if (job.status !== "pending") {
        console.log("❌ [JOB_ACCEPT] Job not available:", {
          status: job.status,
          reason: job.workerId
            ? "Already accepted by another worker"
            : "Job is no longer available",
        });
        socket.emit("job_error", {
          message: job.workerId
            ? "Job already accepted by another worker"
            : "Job is no longer available",
        });
        return;
      }

      // Check if worker exists and is available
      const [worker] = await db
        .select()
        .from(workers)
        .where(eq(workers.id, workerId));

      if (!worker) {
        console.log("❌ [JOB_ACCEPT] Worker not found:", workerId);
        socket.emit("job_error", { message: "Worker not found" });
        return;
      }

      console.log("✅ [JOB_ACCEPT] Worker verified:", {
        workerId,
        name: `${worker.firstName} ${worker.lastName}`,
      });

      // Update job with worker assignment
      console.log("💾 [JOB_ACCEPT] Updating job status to confirmed...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          workerId,
          status: "confirmed",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_ACCEPT] Job status updated successfully");

      // Join job room for real-time updates
      const jobRoom = `job-${jobId}`;
      socket.join(jobRoom);
      console.log("🏠 [SOCKET_ROOM] Worker joined job room:", jobRoom);

      // Start live location tracking for this job
      activeJobTracking.set(jobId, {
        jobId,
        workerId,
        userId: job.userId,
        socketId: socket.id,
        lastUpdate: new Date(),
      });

      console.log("📍 [LOCATION_TRACKING] Started tracking for job:", jobId);

      // Notify user that job has been accepted
      console.log("📤 [SOCKET_EMIT] Notifying user about job acceptance");
      io.to(`user-${job.userId}`).emit("job_accepted", {
        job: updatedJob,
        worker: {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          phoneNumber: worker.phoneNumber,
          experienceYears: worker.experienceYears,
        },
        trackingEnabled: true,
      });

      // Notify the accepting worker
      console.log("📤 [SOCKET_EMIT] Confirming job acceptance to worker");
      socket.emit("job_accepted_success", {
        job: updatedJob,
        message: "Job accepted successfully! Start sharing your location.",
        trackingEnabled: true,
      });

      // Notify other workers that job is no longer available
      console.log(
        "📤 [SOCKET_EMIT] Notifying other workers that job is unavailable"
      );
      io.emit("job_unavailable", {
        jobId,
        message: "This job has been accepted by another worker",
      });

      console.log(
        "🎉 [JOB_ACCEPT] Job acceptance process completed successfully"
      );
    } catch (error) {
      console.error("❌ [JOB_ACCEPT] Error accepting job:", error);
      socket.emit("job_error", { message: "Failed to accept job" });
    }
  });

  // New event: Update live location during job
  socket.on(
    "update_location",
    async ({ jobId, workerId, lat, lng }: UpdateLocationPayload) => {
      console.log("📍 [LOCATION_UPDATE] Worker updating location:", {
        jobId,
        workerId,
        lat,
        lng,
      });

      try {
        // Verify this worker is tracking this job
        const trackingSession = activeJobTracking.get(jobId);
        if (!trackingSession || trackingSession.workerId !== workerId) {
          console.log(
            "❌ [LOCATION_UPDATE] Unauthorized location update attempt"
          );
          socket.emit("location_error", {
            message: "Not authorized to update location for this job",
          });
          return;
        }

        // Update live location in database
        await db
          .update(liveLocations)
          .set({
            lat,
            lng,
          })
          .where(eq(liveLocations.workerId, workerId));

        // Update tracking session
        trackingSession.lastUpdate = new Date();
        activeJobTracking.set(jobId, trackingSession);

        // Share location with user
        console.log("📤 [SOCKET_EMIT] Sharing location with user");
        io.to(`user-${trackingSession.userId}`).emit("worker_location_update", {
          jobId,
          workerId,
          lat,
          lng,
          timestamp: new Date().toISOString(),
          workerName: `${trackingSession.workerId}`, // You can enhance this with actual worker name
        });

        // Confirm to worker
        socket.emit("location_updated", {
          message: "Location updated successfully",
          timestamp: new Date().toISOString(),
        });

        console.log(
          "✅ [LOCATION_UPDATE] Location updated and shared successfully"
        );
      } catch (error) {
        console.error("❌ [LOCATION_UPDATE] Error updating location:", error);
        socket.emit("location_error", { message: "Failed to update location" });
      }
    }
  );

  socket.on(
    "decline_job",
    async ({ jobId, workerId, reason }: DeclineJobPayload) => {
      console.log("❌ [JOB_DECLINE] Worker declining job:", {
        jobId,
        workerId,
        reason,
      });

      try {
        // Log the decline for analytics
        console.log(
          `📊 [JOB_DECLINE] Decline logged for worker ${workerId} on job ${jobId}${
            reason ? `: ${reason}` : ""
          }`
        );

        // Notify the worker that decline was processed
        console.log("📤 [SOCKET_EMIT] Confirming job decline to worker");
        socket.emit("job_declined", {
          jobId,
          message: "Job declined successfully",
        });

        console.log("✅ [JOB_DECLINE] Job decline processed successfully");
      } catch (error) {
        console.error("❌ [JOB_DECLINE] Error declining job:", error);
        socket.emit("job_error", { message: "Failed to decline job" });
      }
    }
  );

  socket.on("start_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("🚀 [JOB_START] Worker attempting to start job:", {
      jobId,
      workerId,
    });

    try {
      // Verify worker owns this job
      const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, jobId), eq(jobs.workerId, workerId)));

      if (!job) {
        console.log("❌ [JOB_START] Job not found or unauthorized:", {
          jobId,
          workerId,
        });
        socket.emit("job_error", { message: "Job not found or unauthorized" });
        return;
      }

      console.log("📋 [JOB_START] Job verified:", {
        jobId,
        status: job.status,
      });

      if (job.status !== "confirmed") {
        console.log("❌ [JOB_START] Job not in confirmed status:", job.status);
        socket.emit("job_error", {
          message: "Job must be confirmed before starting",
        });
        return;
      }

      // Update job status to in_progress
      console.log("💾 [JOB_START] Updating job status to in_progress...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          status: "in_progress",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_START] Job status updated to in_progress");

      // Notify user that work has started
      console.log("📤 [SOCKET_EMIT] Notifying user that work has started");
      io.to(`user-${job.userId}`).emit("job_started", {
        job: updatedJob,
        message: "Worker has started the job",
      });

      // Notify worker
      console.log("📤 [SOCKET_EMIT] Confirming job start to worker");
      socket.emit("job_started_success", {
        job: updatedJob,
        message: "Job started successfully!",
      });

      console.log("🎉 [JOB_START] Job start process completed successfully");
    } catch (error) {
      console.error("❌ [JOB_START] Error starting job:", error);
      socket.emit("job_error", { message: "Failed to start job" });
    }
  });

  socket.on("complete_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("✅ [JOB_COMPLETE] Worker attempting to complete job:", {
      jobId,
      workerId,
    });

    try {
      // Verify worker owns this job
      const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, jobId), eq(jobs.workerId, workerId)));

      if (!job) {
        console.log("❌ [JOB_COMPLETE] Job not found or unauthorized:", {
          jobId,
          workerId,
        });
        socket.emit("job_error", { message: "Job not found or unauthorized" });
        return;
      }

      console.log("📋 [JOB_COMPLETE] Job verified:", {
        jobId,
        status: job.status,
      });

      if (job.status !== "in_progress") {
        console.log("❌ [JOB_COMPLETE] Job not in progress:", job.status);
        socket.emit("job_error", {
          message: "Job must be in progress before completing",
        });
        return;
      }

      // Update job status to completed
      console.log("💾 [JOB_COMPLETE] Updating job status to completed...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          status: "completed",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_COMPLETE] Job status updated to completed");

      // Stop live location tracking
      if (activeJobTracking.has(jobId)) {
        activeJobTracking.delete(jobId);
        console.log("📍 [LOCATION_TRACKING] Stopped tracking for job:", jobId);
      }

      // Notify user that job is completed and tracking stopped
      console.log("📤 [SOCKET_EMIT] Notifying user that job is completed");
      io.to(`user-${job.userId}`).emit("job_completed", {
        job: updatedJob,
        message: "Job has been completed successfully!",
        trackingStopped: true,
      });

      // Notify worker
      console.log("📤 [SOCKET_EMIT] Confirming job completion to worker");
      socket.emit("job_completed_success", {
        job: updatedJob,
        message: "Job completed successfully! Location tracking stopped.",
        trackingStopped: true,
      });

      console.log(
        "🎉 [JOB_COMPLETE] Job completion process completed successfully"
      );
    } catch (error) {
      console.error("❌ [JOB_COMPLETE] Error completing job:", error);
      socket.emit("job_error", { message: "Failed to complete job" });
    }
  });

  // Handle socket disconnect - clean up tracking
  socket.on("disconnect", () => {
    console.log("🔌 [SOCKET_DISCONNECT] Socket disconnected:", socket.id);

    // Find and clean up any active tracking sessions for this socket
    for (const [jobId, session] of activeJobTracking.entries()) {
      if (session.socketId === socket.id) {
        activeJobTracking.delete(jobId);
        console.log(
          "📍 [LOCATION_TRACKING] Stopped tracking for job due to disconnect:",
          jobId
        );

        // Notify user that tracking stopped
        io.to(`user-${session.userId}`).emit("tracking_stopped", {
          jobId,
          message: "Worker disconnected. Location tracking stopped.",
        });
      }
    }
  });

  console.log(
    "✅ [SOCKET_HANDLER] Job socket handlers registered successfully"
  );
};

// Export tracking functions for external use
export const getActiveTrackingSessions = () => {
  return Array.from(activeJobTracking.values());
};

export const stopTrackingForJob = (jobId: string) => {
  if (activeJobTracking.has(jobId)) {
    const session = activeJobTracking.get(jobId);
    activeJobTracking.delete(jobId);
    console.log(
      "📍 [LOCATION_TRACKING] Manually stopped tracking for job:",
      jobId
    );
    return session;
  }
  return null;
};
