import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { env } from "../config/env.config";

// ─── AppError Class ─────────────────────────────────────────────────────────

/**
 * Custom application error class.
 *
 * - `statusCode`: HTTP status to return to the client (4xx = client error, 5xx = server error)
 * - `isOperational`: true = expected/safe error (e.g., 404, validation failure).
 *                    false = unexpected programmer error (e.g., DB schema mismatch).
 *
 * Only operational errors expose their message to the client.
 * Non-operational errors return a generic "Internal server error" message.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8 (Node.js / Chrome)
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Standardized Error Response Shape ─────────────────────────────────────

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  stack?: string;
}

// ─── Global Error Handler Middleware ────────────────────────────────────────

/**
 * Centralized Express error-handling middleware.
 *
 * Must be registered LAST in app.ts (after all routes).
 * Catches errors forwarded via next(err) from any route or middleware.
 *
 * Behavior:
 * - AppError (operational): returns the error's statusCode + message.
 * - Mongoose ValidationError: maps to 400 Bad Request.
 * - Mongoose CastError (invalid ObjectId): maps to 400 Bad Request.
 * - All other errors: returns 500 with a generic message.
 * - In development mode, includes the stack trace in the response.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const isDev = (process.env["NODE_ENV"] ?? "development") === "development";

  // ── Operational AppError ─────────────────────────────────────────────────
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.isOperational ? err.message : "Internal server error",
      ...(isDev && { stack: err.stack }),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // ── Mongoose Validation Error ────────────────────────────────────────────
  if (isMongooseValidationError(err)) {
    const messages = Object.values(err.errors)
      .map((e: { message: string }) => e.message)
      .join(", ");
    const body: ErrorResponse = {
      success: false,
      statusCode: 400,
      message: `Validation error: ${messages}`,
      ...(isDev && err instanceof Error && { stack: err.stack }),
    };
    res.status(400).json(body);
    return;
  }

  // ── Mongoose CastError (e.g. invalid ObjectId) ────────────────────────────
  if (isMongooseCastError(err)) {
    const body: ErrorResponse = {
      success: false,
      statusCode: 400,
      message: `Invalid value for field: ${err.path}`,
      ...(isDev && err instanceof Error && { stack: err.stack }),
    };
    res.status(400).json(body);
    return;
  }

  // ── Unknown / Programmer Error ────────────────────────────────────────────
  const unknownStack = err instanceof Error ? err.stack : undefined;
  console.error("❌ Unhandled error:", err);

  const body: ErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Internal server error",
    ...(isDev && { stack: unknownStack }),
  };
  res.status(500).json(body);
};

// ─── Type Guards ─────────────────────────────────────────────────────────────

interface MongooseValidationError {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
  stack?: string;
}

interface MongooseCastError {
  name: "CastError";
  path: string;
  stack?: string;
}

function isMongooseValidationError(err: unknown): err is MongooseValidationError {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: string }).name === "ValidationError" &&
    "errors" in err
  );
}

function isMongooseCastError(err: unknown): err is MongooseCastError {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: string }).name === "CastError" &&
    "path" in err
  );
}

// ─── Not-Found Handler ────────────────────────────────────────────────────────

/**
 * Catches any request that did not match a registered route.
 * Mount this BEFORE the errorHandler in app.ts.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
