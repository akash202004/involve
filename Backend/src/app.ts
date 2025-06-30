import express from "express";
import userRoutes from "./routes/user.routes";
import workerRoutes from "./routes/worker.routes";
import specializationRoutes from "./routes/specialization.routes";
import liveLocationRoutes from "./routes/liveLocation.routes";
import jobRoutes from "./routes/job.routes";
import transactionRoutes from "./routes/transaction.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Hexafalls Backend is running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/v1/users",
      workers: "/api/v1/workers",
      jobs: "/api/v1/jobs",
      specializations: "/api/v1/specializations",
      liveLocations: "/api/v1/live-locations",
      transactions: "/api/v1/transactions",
      reviews: "/api/v1/reviews",
      notifications: "/api/v1/notifications",
      dashboard: "/api/v1/dashboard"
    }
  });
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workers", workerRoutes);
app.use("/api/v1/specializations", specializationRoutes);
app.use("/api/v1/live-locations", liveLocationRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;