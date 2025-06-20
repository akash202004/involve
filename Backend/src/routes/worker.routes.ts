import express from "express";
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "@/controllers/worker.controller";

const router = express.Router();

router.post("/", createWorker);
router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);

export default router;
