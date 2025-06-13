import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  boolean,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum } from "./enum";

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 30 }),
  phoneNumber: varchar("phone_number", { length: 12 }),
  location: text("location"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Specializations Table
export const specializations = pgTable("specializations", {
  id: varchar("id").primaryKey(),
  workerId: integer("worker_id").references(() => workers.id),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workers Table
export const workers = pgTable("workers", {
  id: varchar("id").primaryKey(),
  name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 30 }),
  location: text("location"),
  description: text("description"),
  phoneNumber: varchar("phone_number", { length: 12 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Worker Location Table
export const liveLocations = pgTable("workers_location", {
  id: varchar("id").primaryKey(),
  workerId: integer("worker_id").references(() => workers.id),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  workerId: integer("worker_id").references(() => workers.id),
  status: orderStatusEnum("status").default("pending"),
  bookedFor: timestamp("booked_for"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey(),
  orderId: varchar("order_id").references(() => orders.id),
  paymentId: varchar("payment_id", { length: 100 }),
  razorpaySignature: varchar("signature", { length: 255 }),
  localOrderRef: integer("local_order_id"),
  amount: doublePrecision("amount"),
  currency: varchar("currency", { length: 10 }).default("INR"),
  status: paymentStatusEnum("status"),
  method: paymentMethodEnum("method"),
  description: text("description"),
  email: varchar("email", { length: 100 }),
  contact: varchar("contact", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
