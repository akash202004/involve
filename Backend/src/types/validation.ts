import { z } from "zod";

export const userSchema = z.object({
  id: z.string({ message: "ID is required" }),

  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name must be at most 100 characters" }),

  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  phoneNumber: z
    .string({ message: "Phone number is required" })
    .length(12, { message: "Phone number must be exactly 12 digits" }),

  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .optional(),

  address: z.string({ message: "Address must be a string" }).optional(),

  city: z
    .string({ message: "City must be a string" })
    .max(50, { message: "City must be at most 50 characters" })
    .optional(),

  state: z
    .string({ message: "State must be a string" })
    .max(50, { message: "State must be at most 50 characters" })
    .optional(),

  country: z
    .string({ message: "Country must be a string" })
    .max(50, { message: "Country must be at most 50 characters" })
    .optional(),

  zipCode: z
    .number({ message: "Zip code must be a number" })
    .int({ message: "Zip code must be an integer" })
    .positive({ message: "Zip code must be a positive number" })
    .optional(),

  autoLocation: z.string({ message: "Auto location is required" }),

  lat: z.number({ message: "Latitude must be a number" }).optional(),

  lng: z.number({ message: "Longitude must be a number" }).optional(),

  createdAt: z.date({ message: "CreatedAt must be a date" }).optional(),
});

export const workerSchema = z.object({
  id: z.string({ message: "Worker ID is required" }),

  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name cannot be empty" })
    .max(100, { message: "First name must be at most 100 characters" }),

  middleName: z
    .string({ message: "Middle name must be a string" })
    .max(100, { message: "Middle name must be at most 100 characters" })
    .optional(),

  lastName: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name cannot be empty" })
    .max(100, { message: "Last name must be at most 100 characters" }),

  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .optional(),

  profilePicture: z
    .string({ message: "Profile picture must be a string" })
    .optional(),

  address: z.string({ message: "Address is required" }),

  description: z.string({ message: "Description must be a string" }).optional(),

  phoneNumber: z
    .string({ message: "Phone number is required" })
    .length(13, { message: "Phone number must be exactly 13 digits" }),

  dateOfBirth: z.date({
    message: "Date of birth is required and must be a valid date",
  }),

  gender: z
    .enum(["male", "female", "not_specified"], {
      errorMap: () => ({
        message: "Gender must be either 'male', 'female', or 'not_specified'",
      }),
    })
    .default("not_specified"),

  experienceYears: z
    .number({ message: "Experience years must be a number" })
    .int({ message: "Experience years must be an integer" })
    .min(0, { message: "Experience years must be at least 0" })
    .default(0),

  panCard: z
    .string({ message: "PAN card must be a string" })
    .max(15, { message: "PAN card must be at most 15 characters" })
    .optional(),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const specializationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  category: z.string().min(1).max(100),
  subCategory: z.string().max(100),
  createdAt: z.date().optional(),
});

export const liveLocationSchema = z.object({
  id: z.string({ message: "Location ID is required" }),

  workerId: z.string({ message: "Worker ID is required" }),

  lat: z.number({ message: "Latitude must be a number" }),

  lng: z.number({ message: "Longitude must be a number" }),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const jobSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workerId: z.string(),
  status: z
    .enum(["pending", "confirmed", "in_progress", "completed", "cancelled"])
    .default("pending"),
  bookedFor: z.date(),
  durationMinutes: z.number().int().positive(),
  createdAt: z.date().optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  jobId: z.string(),
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
  jobId: z.string(),
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
