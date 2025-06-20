import express from "express";
import {
  // createJob,
  getAllJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
} from "@/controllers/job.controller";

const router = express.Router();

// router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJob);

export default router;
