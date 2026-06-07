import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Zod schema for all required environment variables.
 * The server will fail fast at startup if any key is missing or invalid.
 */
const EnvSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a numeric string")
    .transform(Number)
    .refine((n) => n > 0 && n < 65536, "PORT must be between 1 and 65535"),
  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI is required")
    .startsWith("mongodb", "MONGO_URI must be a valid MongoDB connection string"),
  SUPABASE_URL: z
    .string()
    .url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL must be a valid URL"),
  BACKEND_URL: z
    .string()
    .url("BACKEND_URL must be a valid URL"),

  // ─── Auth ────────────────────────────────────────────────────────────────
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

  // ─── SMTP ────────────────────────────────────────────────────────────────
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z
    .string()
    .regex(/^\d+$/, "SMTP_PORT must be numeric")
    .transform(Number),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),
});

/**
 * Inferred TypeScript type of the validated environment config.
 */
export type Env = z.infer<typeof EnvSchema>;

/**
 * Parse and validate process.env at module load time.
 * Throws a formatted error listing all validation failures — preventing
 * the server from booting with a broken configuration.
 */
function parseEnv(): Readonly<Env> {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.errors
      .map((e) => `  • ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    throw new Error(
      `\n🚫 Environment validation failed:\n${formatted}\n\n` +
        `See .env.example for required variables.\n`
    );
  }

  return Object.freeze(result.data);
}

/**
 * Strictly-typed, immutable environment configuration object.
 * Import this instead of accessing process.env directly anywhere in the app.
 */
export const env: Readonly<Env> = parseEnv();
