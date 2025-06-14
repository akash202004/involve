import express from "express";
import {
  createLiveLocation,
  getAllLiveLocations,
  getLiveLocationsByWorker,
  deleteLiveLocation
} from "@/controllers/liveLocation.controller";

const router = express.Router();

router.post("/", createLiveLocation);
router.get("/", getAllLiveLocations);
router.get("/:workerId", getLiveLocationsByWorker);
router.delete("/:id", deleteLiveLocation);

export default router;
