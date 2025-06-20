// src/server.ts
import { createServer } from "http";
import app from "./app";
import { initSocketServer } from "@/sockets/socket.server";
import { initJobSubscriber } from "@/sockets/job.subscriber";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Setup socket.io
initSocketServer(server);

// Start Redis pub/sub listener
initJobSubscriber();

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
