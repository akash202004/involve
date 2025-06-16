import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { jobs } from "@/db/schema";
import { workers } from "@/db/schema";
import { users } from "@/db/schema";
import { jobSchema } from "@/types/validation";
import { eq } from "drizzle-orm";

// ✅ Create Order
export const createJob = async (req: Request, res: Response) => {
  try {
    const parsed = jobSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, parsed.userId));
    if (!userExists.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const workerExists = await db
      .select()
      .from(workers)
      .where(eq(workers.id, parsed.workerId));
    if (!workerExists.length) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    const newJob = await db
      .insert(jobs)
      .values({
        userId: parsed.userId,
        workerId: parsed.workerId,
        status: parsed.status ?? "pending",
        bookedFor: parsed.bookedFor,
        durationMinutes: parsed.durationMinutes,
      })
      .returning();

    res.status(201).json({ message: "Order created", data: newJob[0] });
  } catch (error) {
    console.error("Job creation failed:", error);
    res.status(400).json({ error: "Invalid data or failed to create job" });
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

// ✅ Update Order Status
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
    console.error(error);
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
