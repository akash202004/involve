import { pgEnum } from "drizzle-orm/pg-core";

export const jobStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "created",
  "authorized",
  "captured",
  "failed",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "card",
  "upi",
  "netbanking",
  "wallet",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "general",
  "success",
  "warning",
  "error",
  "info",
  "transaction",
  "order_status_update",
  "worker_location_update",
]);
