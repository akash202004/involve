import { db } from "@/config/drizzle";
import { workers } from "@/db/schema";
import { workerSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { liveLocations } from "@/db/schema";

// Create Worker
export const createWorker = async (req: Request, res: Response) => {
  try {
    const parsedData = workerSchema.omit({ createdAt: true, id: true }).parse(req.body);

    const formattedData = {
      ...parsedData,
      dateOfBirth: parsedData.dateOfBirth.toISOString().split("T")[0],
    };

    const newWorker = await db
      .insert(workers)
      .values(formattedData)
      .returning();

    res.status(201).json({ message: "Worker created", data: newWorker[0] });
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
    res.status(400).json({ error: error.message || "Failed to create worker" });
    return;
  }
};

//  Get All Workers
export const getAllWorkers = async (_req: Request, res: Response) => {
  try {
    const allWorkers = await db.select().from(workers);
    res.status(200).json({ data: allWorkers });
  } catch (error) {
    console.error("Error fetching workers:", error);

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

    res.status(200).json({ data: worker[0] });
  } catch (error) {
    console.error("Error fetching worker:", error);
    res.status(500).json({ error: "Failed to fetch worker" });
    return;
  }
};

// Get Worker by Email
export const getWorkerByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const worker = await db.select().from(workers).where(eq(workers.email, email));

    if (worker.length === 0) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    res.status(200).json({ data: worker[0] });
  } catch (error) {
    console.error("Error fetching worker by email:", error);
    res.status(500).json({ error: "Failed to fetch worker" });
    return;
  }
};

//  Update Worker
export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = workerSchema.partial().parse(req.body);

    // Format data for database
    const updatedData: any = { ...parsedData };
    if (parsedData.dateOfBirth) {
      updatedData.dateOfBirth = parsedData.dateOfBirth
        .toISOString()
        .split("T")[0];
    }

    const updated = await db
      .update(workers)
      .set(updatedData)
      .where(eq(workers.id, id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Worker not found or not updated" });
      return;
    }

    res.status(200).json({ message: "Worker updated", data: updated[0] });
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
    res.status(400).json({ error: error.message || "Failed to update worker" });
    return;
  }
};

//  Delete Worker
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
    console.error("Error deleting worker:", error);
    res.status(500).json({ error: "Failed to delete worker" });
    return;
  }
};

// Update Worker Availability
export const updateWorkerAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive, lat, lng } = req.body;

    // Validate the worker exists
    const existingWorker = await db
      .select()
      .from(workers)
      .where(eq(workers.id, id));

    if (existingWorker.length === 0) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    // Update availability and last active timestamp
    const updateData: any = {
      isActive: isActive,
      lastActiveAt: isActive ? new Date() : null,
    };

    const updated = await db
      .update(workers)
      .set(updateData)
      .where(eq(workers.id, id))
      .returning();

    // If worker is going live and location is provided, update live location
    if (isActive && lat && lng) {
      try {
        // Check if live location exists for this worker
        const existingLocation = await db
          .select()
          .from(liveLocations)
          .where(eq(liveLocations.workerId, id));

        if (existingLocation.length > 0) {
          // Update existing location
          await db
            .update(liveLocations)
            .set({ lat, lng })
            .where(eq(liveLocations.workerId, id));
        } else {
          // Create new location record
          await db
            .insert(liveLocations)
            .values({ workerId: id, lat, lng });
        }
      } catch (locationError) {
        console.error("Error updating live location:", locationError);
        // Don't fail the entire request if location update fails
      }
    }

    res.status(200).json({ 
      message: "Worker availability updated", 
      data: updated[0] 
    });
  } catch (error) {
    console.error("Error updating worker availability:", error);
    res.status(500).json({ error: "Failed to update worker availability" });
    return;
  }
};
