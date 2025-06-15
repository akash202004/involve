import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { liveLocations } from "@/db/schema";
import { workers } from "@/db/schema";
import { liveLocationSchema } from "@/types/validation";
import { eq } from "drizzle-orm";

// ✅ Create a live location
export const createLiveLocation = async (req: Request, res: Response) => {
  try {
    const parsed = liveLocationSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    // 1. Check if worker exists
    const worker = await db
      .select()
      .from(workers)
      .where(eq(workers.id, parsed.workerId));
    if (!worker.length) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    // 2. Insert location
    const inserted = await db.insert(liveLocations).values(parsed).returning();
    res.status(201).json({ message: "Location added", data: inserted[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid input or server error" });
    return;
  }
};

// ✅ Get all live locations
export const getAllLiveLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await db.select().from(liveLocations);
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch live locations" });
    return;
  }
};

// ✅ Get live locations by workerId
export const getLiveLocationsByWorker = async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;

    const locations = await db
      .select()
      .from(liveLocations)
      .where(eq(liveLocations.workerId, workerId));

    if (!locations.length) {
      res.status(404).json({ error: "No locations found for this worker" });
      return;
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get location" });
    return;
  }
};

// ✅ Delete a live location by ID (optional)
export const deleteLiveLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(liveLocations)
      .where(eq(liveLocations.id, id))
      .returning();

    if (!deleted.length) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json({ message: "Location deleted", data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete location" });
    return;
  }
};
