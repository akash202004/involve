import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { orders } from "@/db/schema";
import { workers } from "@/db/schema";
import { users } from "@/db/schema";
import { orderSchema } from "@/types/validation";
import { eq } from "drizzle-orm";

// ✅ Create Order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const parsed = orderSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    // ✅ Check if user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, parsed.userId));
    if (!userExists.length) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Check if worker exists
    const workerExists = await db
      .select()
      .from(workers)
      .where(eq(workers.id, parsed.workerId));
    if (!workerExists.length) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // ✅ Insert order (only required fields)
    const newOrder = await db
      .insert(orders)
      .values({
        userId: parsed.userId,
        workerId: parsed.workerId,
        status: parsed.status ?? "pending",
        bookedFor: parsed.bookedFor,
        durationMinutes: parsed.durationMinutes,
      })
      .returning();

    return res
      .status(201)
      .json({ message: "Order created", data: newOrder[0] });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res
      .status(400)
      .json({ error: "Invalid data or failed to create order" });
  }
};

// ✅ Get All Orders
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders);
    res.status(200).json(allOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
    return;
  }
};

// ✅ Get Order By ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await db.select().from(orders).where(eq(orders.id, id));

    if (!order.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get order" });
    return;
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ] as const;

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }

    const updated = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order status updated", data: updated[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update order status" });
    return;
  }
};

// ✅ Delete Order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    if (!deleted.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted", data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
    return;
  }
};
