interface JobUpdate {
  jobId: string;
  lat: number;
  lng: number;
  sender?: string;
  message?: string;
}

export const registerJobLiveHandlers = (socket: any) => {
  socket.on("worker_location_update", ({ jobId, lat, lng }: JobUpdate) => {
    socket.to(`job-${jobId}`).emit("location_update", { lat, lng });
  });

  socket.on("job_chat", ({ jobId, sender, message }: JobUpdate) => {
    socket.to(`job-${jobId}`).emit("chat_message", { sender, message });
  });
};
