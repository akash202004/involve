import express from "express";
import {
  healthCheck,
  createJob,
  getAllJobs,
  getJobStats,
  getNearbyWorkers,
  getBroadcastMetrics,
  resetBroadcastMetrics,
  getJobById,
  updateJobStatus,
  deleteJob
} from "../controllers/job.controller";


const router = express.Router();

router.get("/health", healthCheck);
router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/stats", getJobStats);
router.get("/nearby-workers", getNearbyWorkers);
router.get("/broadcast-metrics", getBroadcastMetrics);
router.post("/broadcast-metrics/reset", resetBroadcastMetrics);
router.get("/:id", getJobById);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJob);

export default router;
