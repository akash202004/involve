import { db } from "../config/drizzle";
import { jobs } from "../db/schema";
import { eq } from "drizzle-orm";
import { io } from "./socket.server";

interface AcceptJobPayload {
  jobId: string;
  workerId: string;
}

export const registerJobSocketHandlers = (socket: any) => {
  socket.on("accept_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    const [updated] = await db
      .update(jobs)
      .set({ workerId, status: "confirmed" })
      .where(eq(jobs.id, jobId))
      .returning();

    const room = `job-${jobId}`;
    socket.join(room);
    io.to(room).emit("job_accepted", updated);
  });
};
