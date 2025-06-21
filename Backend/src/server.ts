// src/server.ts
import { createServer } from "http";
import app from "./app";
import { initSocketServer } from "@/sockets/socket.server";
import { initJobSubscriber } from "@/sockets/job.subscriber";
import { connectRedis } from "@/config/redis";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("🚀 [SERVER] Starting server initialization...");

    // Connect to Redis first
    console.log("🔌 [REDIS] Connecting to Redis...");
    await connectRedis();

    // Create HTTP server
    const server = createServer(app);
    console.log("✅ [SERVER] HTTP server created");

    // Setup socket.io
    console.log("🔌 [SOCKET] Initializing Socket.IO...");
    initSocketServer(server);
    console.log("✅ [SOCKET] Socket.IO initialized");

    // Start Redis pub/sub listener
    console.log("📡 [REDIS] Initializing job subscriber...");
    await initJobSubscriber();
    console.log("✅ [REDIS] Job subscriber initialized");

    // Start server
    server.listen(PORT, () => {
      console.log(`🎉 [SERVER] Server running at http://localhost:${PORT}`);
      console.log("✅ [SERVER] All systems initialized successfully!");
    });
  } catch (error) {
    console.error("❌ [SERVER] Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
