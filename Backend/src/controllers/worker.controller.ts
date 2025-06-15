import { db } from "@/config/drizzle";
import { workers } from "@/db/schema";
import { workerSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

// Create Worker
export const createWorker = async (req: Request, res: Response) => {
  try {
    const parsedData = workerSchema.omit({ createdAt: true }).parse(req.body);

    const newWorker = await db.insert(workers).values(parsedData).returning();

    res.status(201).json({ message: "Worker created", data: newWorker[0] });
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
    return;
  }
};

// Get All Workers
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const all = await db.select().from(workers);
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workers" });
    return;
  }
};

// Get Worker by ID
export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const worker = await db.select().from(workers).where(eq(workers.id, id));

    if (worker.length === 0) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    res.status(200).json(worker[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch worker" });
    return;
  }
};

// Update Worker
export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = workerSchema.partial().parse(req.body);

    const updated = await db
      .update(workers)
      .set(parsedData)
      .where(eq(workers.id, id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Worker not found or not updated" });
      return;
    }

    res.status(200).json({ message: "Worker updated", data: updated[0] });
  } catch (error) {
    res.status(400).json({ error: "Failed to update worker" });
    return;
  }
};

// Delete Worker
export const deleteWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db
      .delete(workers)
      .where(eq(workers.id, id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    res.status(200).json({ message: "Worker deleted", data: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete worker" });
    return;
  }
};
