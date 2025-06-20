import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { jobs } from "@/db/schema";
import { workers } from "@/db/schema";
import { users } from "@/db/schema";
import { jobSchema, userSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { parse } from "dotenv";
import { ZodError } from "zod";
import { redisPub } from "@/config/redis";

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = userSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, parsedData.email));
    if (existingUser.length > 0) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const newUser = await db.insert(users).values(parsedData).returning();
    res.status(201).json({ message: "User created", data: newUser[0] });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res
        .status(400)
        .json({ message: "Validation failed", errors: formattedErrors });
      return;
    }

    console.error("Unhandled error in createUser:", error);
    res.status(400).json({
      error: error?.message || "Failed to create user",
    });
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
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res
        .status(400)
        .json({ message: "Validation failed", errors: formattedErrors });
      return;
    }
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
