import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error.middleware";

// ─── Validation Target ───────────────────────────────────────────────────────

/**
 * The part of the request to validate against the Zod schema.
 * - 'body'   → req.body   (POST/PUT/PATCH payloads)
 * - 'query'  → req.query  (URL query parameters)
 * - 'params' → req.params (URL path parameters)
 */
export type ValidationSource = "body" | "query" | "params";

// ─── Middleware Factory ───────────────────────────────────────────────────────

/**
 * Creates a reusable request validation middleware for a given Zod schema.
 *
 * On success: replaces req[source] with the parsed (and coerced) data,
 *             then calls next() to continue the middleware chain.
 * On failure: formats Zod errors into a readable string and calls
 *             next(new AppError(..., 400)) to forward to the error handler.
 *
 * @param schema - Any Zod schema (z.object, z.array, etc.)
 * @param source - Which part of the request to validate (default: 'body')
 *
 * @example
 * import { z } from 'zod';
 * import { validate } from '../middlewares/validate.middleware';
 *
 * const CreateRideSchema = z.object({
 *   pickupLocation: z.string().min(1),
 *   dropoffLocation: z.string().min(1),
 * });
 *
 * router.post('/rides', validate(CreateRideSchema), rideController.create);
 */
export function validate<T>(
  schema: ZodSchema<T>,
  source: ValidationSource = "body"
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = formatZodError(result.error);
      next(new AppError(message, 400));
      return;
    }

    // Replace the raw request data with the validated + coerced output.
    // This ensures downstream controllers receive clean, typed data.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[source] = result.data;
    next();
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats a ZodError into a human-readable validation message.
 * Groups multiple field errors into a single comma-separated string.
 */
function formatZodError(error: ZodError): string {
  const messages = error.errors.map((e) => {
    const field = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
    return `${field}${e.message}`;
  });
  return `Validation failed — ${messages.join("; ")}`;
}
