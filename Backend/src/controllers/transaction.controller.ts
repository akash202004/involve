import { Request, Response } from "express";
import { db } from "@/lib/db";
import { transactions, users } from "@/models/schema";
import { orders } from "@/models/schema";
import { transactionSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { verifyRazorpaySignature } from "@/utils/verifySignature";

// Usually stored in env
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET!;

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const parsed = transactionSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    // Check order exists
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parsed.orderId));
    if (!order.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // ✅ Verify Razorpay Signature if available
    if (parsed.paymentId && parsed.razorpaySignature) {
      const isValid = verifyRazorpaySignature(
        parsed.orderId,
        parsed.paymentId,
        parsed.razorpaySignature,
        RAZORPAY_SECRET
      );

      if (!isValid) {
        res.status(400).json({ error: "Invalid Razorpay signature" });
        return;
      }
    }

    // Insert transaction
    const result = await db.insert(transactions).values(parsed).returning();
     res
      .status(201)
      .json({ message: "Transaction recorded", data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create transaction" });
    return;
  }
};

// ✅ Get All Transactions
export const getAllTransactions = async (_req: Request, res: Response) => {
  try {
    const all = await db.select().from(transactions);
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
    return;
  }
};

// ✅ Get Transaction By ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    if (!tx.length) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(200).json(tx[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
    return;
  }
};

// ✅ Get Transaction by Order ID
export const gsetTransactionByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const tx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.orderId, orderId));
    if (!tx.length) {
      res.status(404).json({ error: "No transaction found for this order" });
      return;
    }

    res.status(200).json(tx[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
    return;
  }
};

// ✅ Get Transaction by user ID
export const getTransactionByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await db.select().from(users).where(eq(users.id, userId));
    if (!user.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));
    if (!order.length) {
      res.status(404).json({ error: "No order found for this user" });
      return;
    }

    const tx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.orderId, order.id));
    if (!tx.length) {
      res.status(404).json({ error: "No transaction found for this user" });
      return;
    }

    res.status(200).json(tx[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
    return;
  }
};

// ✅ Delete Transaction (optional)
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();
    if (!deleted.length) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(200).json({ message: "Transaction deleted", data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete transaction" });
    return;
  }
};
