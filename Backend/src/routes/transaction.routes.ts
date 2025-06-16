import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionByJobId,
  deleteTransaction
} from "@/controllers/transaction.controller";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.get("/order/:orderId", getTransactionByJobId);
router.delete("/:id", deleteTransaction);

export default router;
