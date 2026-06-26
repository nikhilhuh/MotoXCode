import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.config";
import { apiRouter } from "./routes/index";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

// App Factory
const app: Application = express();

// Security Middleware
app.use(helmet());

/** Restrict cross-origin requests to the configured frontend origin */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Utility Middleware
app.use(morgan(process.env["NODE_ENV"] === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRouter);

// Health Check
app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Error Handling
/** Catch-all for unmatched routes — must come after all route mounts */
app.use(notFoundHandler);

/** Global async error handler — must be the very last middleware */
app.use(errorHandler);

export { app };
