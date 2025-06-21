import express from "express";
import {
  createLiveLocation,
  getAllLiveLocations,
  getLiveLocationsByWorker,
  deleteLiveLocation,
  updateLiveLocationByWorkerId,
  updateLiveLocation,
  getActiveTrackingSessions,
  stopTrackingForJob,
  getTrackingStatus
} from "@/controllers/liveLocation.controller";

const router = express.Router();

router.post("/", createLiveLocation);
router.get("/", getAllLiveLocations);
router.get("/:workerId", getLiveLocationsByWorker);
router.put("/worker/:workerId", updateLiveLocationByWorkerId);
router.put("/:id", updateLiveLocation);
router.delete("/:id", deleteLiveLocation);

// New tracking routes
router.get("/tracking/sessions", getActiveTrackingSessions);
router.get("/tracking/status/:jobId", getTrackingStatus);
router.post("/tracking/stop/:jobId", stopTrackingForJob);

export default router;
