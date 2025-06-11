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

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 30 }),
  location: text("location"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workers Table
export const worker = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 30 }),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Worker Location Table
export const workerLocation = pgTable("workers_location", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => worker.id),
  location: text("location"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  workerId: integer("worker_id").references(() => worker.id),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  amount: doublePrecision("amount"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
