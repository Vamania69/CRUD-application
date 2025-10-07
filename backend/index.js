import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import connectDB from "./config/database.js";
import userRoutes from "./userRoutes/users.js";
import { getDatabaseStatus } from "./config/database.js";
import { generalRateLimit, errorHandler, requestLogger } from "./middleware/validation.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(generalRateLimit);

// Request logging
app.use(requestLogger);

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    message: "CRUD Application API",
    status: "running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    status: "OK",
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`📍 API base: http://localhost:${port}/api`);
});

export default app;
