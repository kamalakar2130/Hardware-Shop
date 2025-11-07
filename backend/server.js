import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cluster from "cluster";
import os from "os";
import logger from "./src/config/logger.js";
import connectDB from "./src/config/db.js"; // Adjust path if needed
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.error(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  // ✅ Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: "http://localhost:5173", // your React frontend URL
      credentials: true, // allow cookies to pass
    })
  );
  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);

  // ✅ Routes
  app.use("/api/users", userRoutes); // User CRUD or info
  app.use("/api/auth", authRoutes); // Login, Register, JWT, etc.

  // ✅ Basic route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  // ✅ Error handling
  app.use(notFound);
  app.use(errorHandler);

  // ✅ Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}
