import { db } from "@/config/drizzle";
import { specializations, workers } from "@/db/schema";
import { specializationSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";

// Create Specialization
export const createSpecialization = async (req: Request, res: Response) => {
  try {
    const parsedData = specializationSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);
    const { workerId } = parsedData;

    const existingWorker = await db
      .select()
      .from(workers)
      .where(eq(workers.id, workerId));

    if (existingWorker.length === 0) {
      res.status(404).json({ error: "Worker ID not found" });
      return;
    }

    const newSpec = await db
      .insert(specializations)
      .values(parsedData)
      .returning();

    res
      .status(201)
      .json({ message: "Specialization created", data: newSpec[0] });
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
    res.status(400).json({ error: "Failed to create specialization" });
    return;
  }
};

// Get All Specializations
export const getAllSpecializations = async (req: Request, res: Response) => {
  try {
    const all = await db.select().from(specializations);
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specializations" });
    return;
  }
};

// Get Specializations by Worker ID
export const getSpecializationsByWorker = async (
  req: Request,
  res: Response
) => {
  try {
    const { workerId } = req.params;

    const specs = await db
      .select()
      .from(specializations)
      .where(eq(specializations.workerId, workerId));

    if (specs.length === 0) {
      res
        .status(404)
        .json({ error: "No specializations found for this worker" });
      return;
    }

    res.status(200).json(specs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specializations" });
    return;
  }
};

// Update Specialization
export const updateSpecialization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = specializationSchema.partial().parse(req.body);

    const updated = await db
      .update(specializations)
      .set(parsedData)
      .where(eq(specializations.id, id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Specialization not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Specialization updated", data: updated[0] });
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
    res.status(400).json({ error: "Failed to update specialization" });
    return;
  }
};

// Delete Specialization
export const deleteSpecialization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(specializations)
      .where(eq(specializations.id, id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Specialization not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Specialization deleted", data: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete specialization" });
    return;
  }
};
