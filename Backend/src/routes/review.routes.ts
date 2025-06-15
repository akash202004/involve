import express from "express";
import { createReview, getReviewsByWorker } from "../controllers/review.controller";

const router = express.Router();

// POST /api/reviews
router.post("/", createReview);

// GET /api/reviews/worker/:workerId
router.get("/worker/:workerId", getReviewsByWorker);

export default router;
