import express from "express";
import {
  createNotification,
  getUserNotifications,
  deleteNotification,
} from "../controllers/notification.controller";

const router = express.Router();

// POST /api/notifications
router.post("/", createNotification);

// GET /api/notifications/:userId
router.get("/:userId", getUserNotifications);

// DELETE /api/notifications/:id
router.delete("/:id", deleteNotification);

export default router;
