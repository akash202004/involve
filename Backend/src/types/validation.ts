import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(30).optional(),
  phoneNumber: z.string().length(12),
  location: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  createdAt: z.date().optional(),
});

export const workerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(30).optional(),
  location: z.string(),
  profilePicture: z.string().optional(),
  description: z.string().optional(),
  phoneNumber: z.string().length(12),
  createdAt: z.date().optional(),
});

export const specializationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  name: z.string().min(1).max(100),
  createdAt: z.date().optional(),
});

export const liveLocationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  lat: z.number(),
  lng: z.number(),
  createdAt: z.date().optional(),
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workerId: z.string(),
  status: z
    .enum(["pending", "confirmed", "in-progress", "completed", "cancelled"])
    .default("pending"),
  createdAt: z.date().optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  paymentId: z.string().optional(),
  razorpaySignature: z.string().max(255).optional(),
  amount: z.number().positive(),
  currency: z.string().max(10),
  status: z.enum(["created", "authorized", "captured", "failed"]),
  method: z.enum(["card", "upi", "netbanking", "wallet"]),
  email: z.string().email().optional(),
  contact: z.string().length(15).optional(),
  createdAt: z.date().optional(),
});

export const reviewSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string(),
  workerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date().optional(),
});

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1).max(100),
  message: z.string(),
  type: z.enum([
    "general",
    "success",
    "warning",
    "error",
    "info",
    "transaction",
    "order_status_update",
    "worker_location_update",
  ]),
  createdAt: z.date().optional(),
});
