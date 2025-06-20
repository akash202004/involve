import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  doublePrecision,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "not_specified"]);

export const jobStatusEnum = pgEnum("job_status", [
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

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }).notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 12 }).notNull(),
  password: varchar("password", { length: 30 }),

  // Manual location input fields
  address: text("address"),
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 50 }),
  zipCode: integer("zip_code"),

  // Auto-detected location fields (via GPS)
  autoLocation: text("auto_location"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Workers Table
export const workers = pgTable("workers", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName").notNull(),
  middleName: text("middleName"),
  lastName: text("lastName").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 30 }),
  profilePicture: varchar("profile_picture", { length: 255 }),
  address: text("location"),
  description: text("description"),
  phoneNumber: varchar("phone_number", { length: 13 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").default("not_specified"),
  experienceYears: integer("experience_years").default(0),
  panCard: varchar("pan_card", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Specializations Table
export const specializations = pgTable("specializations", {
  id: uuid("id").defaultRandom().primaryKey(),
  workerId: uuid("worker_id")
    .references(() => workers.id)
    .notNull(),
  category: varchar("name", { length: 100 }).notNull(),
  subCategory: varchar("sub_category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Worker Live Locations
export const liveLocations = pgTable("live_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  workerId: uuid("worker_id")
    .references(() => workers.id)
    .notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders Table
export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  workerId: uuid("worker_id").references(() => workers.id),
  description: text("description"),
  location: text("address"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  status: jobStatusEnum("status").default("pending"),
  bookedFor: timestamp("booked_for"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),
  paymentId: varchar("payment_id", { length: 100 }),
  razorpaySignature: varchar("signature", { length: 255 }),
  amount: doublePrecision("amount"),
  currency: varchar("currency", { length: 10 }).default("INR"),
  status: paymentStatusEnum("status"),
  method: paymentMethodEnum("method"),
  email: varchar("email", { length: 100 }),
  contact: varchar("contact", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),
  workerId: uuid("worker_id")
    .references(() => workers.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});
