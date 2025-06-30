import express from "express";
import {
  createSpecialization,
  getAllSpecializations,
  getSpecializationsByWorker,
  updateSpecialization,
  deleteSpecialization,
  getWorkersBySpecialization,
} from "@/controllers/specialization.controller";

const router = express.Router();

router.post("/", createSpecialization);
router.get("/", getAllSpecializations);
router.get("/worker/:workerId", getSpecializationsByWorker);
router.get("/workers/:category", getWorkersBySpecialization);
router.get("/workers/:category/:subcategory", getWorkersBySpecialization);
router.put("/:id", updateSpecialization);
router.delete("/:id", deleteSpecialization);

export default router;
