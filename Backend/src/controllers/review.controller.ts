import { db } from "@/config/drizzle";
import { reviews } from "@/db/schema";
import { reviewSchema } from "@/types/validation";
import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  try {
    const parsed = reviewSchema.parse(req.body);

    const review = await db
      .insert(reviews)
      .values({
        jobId: parsed.jobId,
        userId: parsed.userId,
        workerId: parsed.workerId,
        rating: parsed.rating,
        comment: parsed.comment,
      })
      .returning();

    res.status(201).json({ message: "Review created", data: review });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getReviewsByWorker = async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;

    const workerReviews = await db.query.reviews.findMany({
      where: eq(reviews.workerId, workerId),
      orderBy: [desc(reviews.createdAt)],
    });

    res.json(workerReviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
