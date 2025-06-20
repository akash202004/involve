import { Server } from 'socket.io';
import { initSocketRedisAdapter } from "@/config/socketRedis";
import { registerJobSocketHandlers } from "./job.handler"
import { registerJobLiveHandlers } from './jobUpdates.handler';

export let io: Server;

export const initSocketServer = (server: any) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  initSocketRedisAdapter(io);

  io.on('connection', (socket) => {
    socket.on('join_worker_room', ({ workerId }) => {
      socket.join(`worker-${workerId}`);
    });
    socket.on('join_user_room', ({ userId }) => {
      socket.join(`user-${userId}`);
    });
    socket.on('join_job_room', ({ jobId }) => {
      socket.join(`job-${jobId}`);
    });

    registerJobSocketHandlers(socket);
    registerJobLiveHandlers(socket);
  });
};