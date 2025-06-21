import { Server } from "socket.io";
import { initSocketRedisAdapter } from "@/config/socketRedis";
import { registerJobSocketHandlers } from "./job.handler";
import { registerJobLiveHandlers } from "./jobUpdates.handler";

export let io: Server;

export const initSocketServer = (server: any) => {
  console.log("🔌 [SOCKET_SERVER] Initializing Socket.IO server...");

  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  console.log("✅ [SOCKET_SERVER] Socket.IO server created with CORS enabled");

  initSocketRedisAdapter(io);
  console.log("✅ [SOCKET_SERVER] Redis adapter initialized");

  io.on("connection", (socket) => {
    console.log("🔗 [SOCKET_CONNECTION] New socket connected:", socket.id);

    socket.on("join_worker_room", ({ workerId }) => {
      console.log("🏠 [SOCKET_ROOM] Worker joining room:", {
        socketId: socket.id,
        workerId,
      });
      socket.join(`worker-${workerId}`);
      console.log("✅ [SOCKET_ROOM] Worker joined room successfully");
    });

    socket.on("join_user_room", ({ userId }) => {
      console.log("🏠 [SOCKET_ROOM] User joining room:", {
        socketId: socket.id,
        userId,
      });
      socket.join(`user-${userId}`);
      console.log("✅ [SOCKET_ROOM] User joined room successfully");
    });

    socket.on("join_job_room", ({ jobId }) => {
      console.log("🏠 [SOCKET_ROOM] Joining job room:", {
        socketId: socket.id,
        jobId,
      });
      socket.join(`job-${jobId}`);
      console.log("✅ [SOCKET_ROOM] Joined job room successfully");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 [SOCKET_DISCONNECT] Socket disconnected:", {
        socketId: socket.id,
        reason,
      });
    });

    console.log(
      "🔌 [SOCKET_HANDLERS] Registering socket handlers for:",
      socket.id
    );
    registerJobSocketHandlers(socket);
    registerJobLiveHandlers(socket);
    console.log("✅ [SOCKET_HANDLERS] Socket handlers registered successfully");
  });

  console.log("🎉 [SOCKET_SERVER] Socket.IO server initialized successfully");
};
