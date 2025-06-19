import express from "express";
import {
  createLiveLocation,
  getAllLiveLocations,
  getLiveLocationsByWorker,
  deleteLiveLocation,
  updateLiveLocationByWorkerId,
  updateLiveLocation
} from "@/controllers/liveLocation.controller";

const router = express.Router();

router.post("/", createLiveLocation);
router.get("/", getAllLiveLocations);
router.get("/:workerId", getLiveLocationsByWorker);
router.put("/worker/:workerId", updateLiveLocationByWorkerId);
router.put("/:id", updateLiveLocation);
router.delete("/:id", deleteLiveLocation);

export default router;
