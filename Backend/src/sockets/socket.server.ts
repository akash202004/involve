import { Server } from "socket.io";
import http from "http";

export let io: Server;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join_worker_room", ({ workerId }) => {
      socket.join(`worker-${workerId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
