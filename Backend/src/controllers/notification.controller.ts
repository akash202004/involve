import { db } from "@/config/drizzle";
import { notifications } from "@/db/schema";
import { notificationSchema } from "@/types/validation";
import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const parsed = notificationSchema.parse(req.body);

    const notif = await db
      .insert(notifications)
      .values({
        userId: parsed.userId,
        title: parsed.title,
        message: parsed.message,
        type: parsed.type,
      })
      .returning();

    res.status(201).json({ message: "Notification created", data: notif });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userNotifs = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });

    res.json(userNotifs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.delete(notifications).where(eq(notifications.id, id));
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
