import express from "express";
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  getWorkerByEmail,
  updateWorker,
  deleteWorker,
  updateWorkerAvailability,
} from "@/controllers/worker.controller";

const router = express.Router();

router.post("/", createWorker);
router.get("/", getAllWorkers);
router.get("/email/:email", getWorkerByEmail);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.patch("/:id/availability", updateWorkerAvailability);

export default router;
