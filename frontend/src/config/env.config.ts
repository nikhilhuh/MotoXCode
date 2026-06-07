import { z } from "zod";

/**
 * Client-side environment configuration schema.
 * Ensures strict validation of injected Vite environment variables.
 */
const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:4000/api"),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is strictly required"),
});

// Extract typed values from import.meta.env
// Only access explicitly named keys as required by Vite statically.
export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});
