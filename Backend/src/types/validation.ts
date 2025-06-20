import { z } from "zod";

export const userSchema = z.object({
  id: z.string({ message: "ID is required" }).optional(),

  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name must be at most 100 characters" }),

  lastName: z
    .string({ message: "Last name is required" })
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

  autoLocation: z.string({ message: "Auto location is required" }).optional(),

  lat: z.number({ message: "Latitude must be a number" }).optional(),

  lng: z.number({ message: "Longitude must be a number" }).optional(),

  createdAt: z.date({ message: "CreatedAt must be a date" }).optional(),
});

export const workerSchema = z.object({
  id: z.string({ message: "Worker ID is required" }).optional(),

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

  dateOfBirth: z
    .string({ message: "Date of birth is required" })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date of birth must be a valid date",
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
  id: z.string({ message: "Specialization ID is required" }),

  workerId: z.string({ message: "Worker ID is required" }),

  category: z
    .string({ message: "Category is required" })
    .min(1, { message: "Category cannot be empty" })
    .max(100, { message: "Category must be at most 100 characters" }),

  subCategory: z
    .string({ message: "Subcategory is required" })
    .max(100, { message: "Subcategory must be at most 100 characters" }),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const liveLocationSchema = z.object({
  id: z.string({ message: "Location ID is required" }),

  workerId: z.string({ message: "Worker ID is required" }),

  lat: z.number({ message: "Latitude must be a number" }),

  lng: z.number({ message: "Longitude must be a number" }),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const jobSchema = z.object({
  id: z.string({ message: "Job ID is required" }),

  userId: z.string({ message: "User ID is required" }),
  workerId: z.string({ message: "Worker ID is required" }).optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  location: z.string({ message: "Location is required" }),

  lat: z.number({ message: "Latitude is required" }),
  lng: z.number({ message: "Longitude is required" }),

  status: z
    .enum(["pending", "confirmed", "in_progress", "completed", "cancelled"], {
      errorMap: () => ({
        message:
          "Status must be one of: pending, confirmed, in_progress, completed, or cancelled",
      }),
    })
    .default("pending"),

  bookedFor: z.string({
    message: "Booking date (bookedFor) must be a valid date",
  }),

  durationMinutes: z
    .number({
      message: "Duration is required",
    })
    .int({ message: "Duration must be an integer" })
    .positive({ message: "Duration must be a positive number" }),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const transactionSchema = z.object({
  id: z.string({ message: "Transaction ID is required" }),

  jobId: z.string({ message: "Job ID is required" }),

  paymentId: z.string({ message: "Payment ID must be a string" }).optional(),

  razorpaySignature: z
    .string({ message: "Razorpay signature must be a string" })
    .max(255, { message: "Razorpay signature must be at most 255 characters" })
    .optional(),

  amount: z
    .number({ message: "Amount is required" })
    .positive({ message: "Amount must be a positive number" }),

  currency: z
    .string({ message: "Currency is required" })
    .max(10, { message: "Currency must be at most 10 characters" }),

  status: z.enum(["created", "authorized", "captured", "failed"], {
    errorMap: () => ({
      message: "Status must be one of: created, authorized, captured, failed",
    }),
  }),

  method: z.enum(["card", "upi", "netbanking", "wallet"], {
    errorMap: () => ({
      message: "Method must be one of: card, upi, netbanking, wallet",
    }),
  }),

  email: z
    .string({ message: "Email must be a valid string" })
    .email({ message: "Email must be a valid email address" })
    .optional(),

  contact: z
    .string({ message: "Contact must be a string" })
    .length(15, { message: "Contact must be exactly 15 characters" })
    .optional(),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const reviewSchema = z.object({
  id: z.string({ message: "Review ID is required" }),

  jobId: z.string({ message: "Job ID is required" }),

  userId: z.string({ message: "User ID is required" }),

  workerId: z.string({ message: "Worker ID is required" }),

  rating: z
    .number({ message: "Rating is required" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),

  comment: z.string({ message: "Comment must be a string" }).optional(),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});

export const notificationSchema = z.object({
  id: z.string({ message: "Notification ID is required" }),

  userId: z.string({ message: "User ID is required" }),

  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title cannot be empty" })
    .max(100, { message: "Title must be at most 100 characters" }),

  message: z.string({ message: "Message is required" }),

  type: z.enum(
    [
      "general",
      "success",
      "warning",
      "error",
      "info",
      "transaction",
      "order_status_update",
      "worker_location_update",
    ],
    {
      errorMap: () => ({
        message:
          "Type must be one of: general, success, warning, error, info, transaction, order_status_update, worker_location_update",
      }),
    }
  ),

  createdAt: z.date({ message: "CreatedAt must be a valid date" }).optional(),
});
