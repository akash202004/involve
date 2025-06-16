import express from "express";
import userRoutes from "./routes/user.route";
import workerRoutes from "./routes/worker.route";
import specializationRoutes from "./routes/specialization.route";
import liveLocationRoutes from "./routes/liveLocation.routes";
import jobRoutes from "./routes/job.routes";
import transactionRoutes from "./routes/transaction.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import dotnev from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotnev.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("api/v1/users", userRoutes);
app.use("api/v1/workers", workerRoutes);
app.use("api/v1/specializations", specializationRoutes);
app.use("api/v1/live-locations", liveLocationRoutes);
app.use("api/v1/jobs", jobRoutes);
app.use("api/v1/transactions", transactionRoutes);
app.use("api/v1/reviews", reviewRoutes);
app.use("api/v1/notifications", notificationRoutes);

// Global Error Handler
app.use(globalErrorHandler);
