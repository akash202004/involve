import { Socket } from 'socket.io';
import { db } from '../config/drizzle'; // Fixed import for db
import { users } from '../db/schema'; // Your schema definition
import { eq } from 'drizzle-orm';

interface JobUpdate {
  jobId: string;
  lat: number;
  lng: number;
  sender?: string;
  message?: string;
}

interface LocationUpdate {
  jobId: string;
  userId: string;
  lat: number;
  lng: number;
}

// In-memory store for latest user and worker locations per job
const jobLocations: Record<string, { user?: { lat: number; lng: number }, worker?: { lat: number; lng: number } }> = {};

export const registerJobLiveHandlers = (socket: Socket) => {
  // Worker location updates
  socket.on("worker_location_update", async ({ jobId, lat, lng }: JobUpdate) => {
    jobLocations[jobId] = jobLocations[jobId] || {};
    jobLocations[jobId].worker = { lat, lng };

    // Emit both user and worker locations to the room
    socket.to(`job-${jobId}`).emit("location_update", {
      type: 'worker',
      lat,
      lng,
      timestamp: new Date().toISOString()
    });
    if (jobLocations[jobId].user) {
      socket.to(`job-${jobId}`).emit("location_update", {
        type: 'user',
        lat: jobLocations[jobId].user!.lat,
        lng: jobLocations[jobId].user!.lng,
        timestamp: new Date().toISOString()
      });
    }
  });

  // User location updates (when user shares live location)
  socket.on("user_location_update", async ({ jobId, userId, lat, lng }: LocationUpdate) => {
    jobLocations[jobId] = jobLocations[jobId] || {};
    jobLocations[jobId].user = { lat, lng };

    // Update user's location in database
    await db.update(users)
      .set({ lat, lng })
      .where(eq(users.id, userId));

    // Emit both user and worker locations to the room
    socket.to(`job-${jobId}`).emit("location_update", {
      type: 'user',
      lat,
      lng,
      timestamp: new Date().toISOString()
    });
    if (jobLocations[jobId].worker) {
      socket.to(`job-${jobId}`).emit("location_update", {
        type: 'worker',
        lat: jobLocations[jobId].worker!.lat,
        lng: jobLocations[jobId].worker!.lng,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Job chat messages
  socket.on("job_chat", ({ jobId, sender, message }: JobUpdate) => {
    socket.to(`job-${jobId}`).emit("chat_message", {
      sender,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Join job room when assigned
  socket.on("join_job", (jobId: string) => {
    socket.join(`job-${jobId}`);
    console.log(`Socket ${socket.id} joined job room ${jobId}`);
  });

  // Leave job room when completed
  socket.on("leave_job", (jobId: string) => {
    socket.leave(`job-${jobId}`);
    console.log(`Socket ${socket.id} left job room ${jobId}`);
  });
};