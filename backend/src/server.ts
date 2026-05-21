import "dotenv/config";
import http from "http";

import { app } from "./app";
import { env } from "./config/env.config";
import { connectDB, disconnectDB } from "./config/db";

// ─── Server Instance ──────────────────────────────────────────────────────────

const server = http.createServer(app);

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

/**
 * Performs an orderly shutdown of all server resources.
 * Closes the HTTP server first (stops accepting new connections),
 * then disconnects from MongoDB to avoid hanging async operations.
 *
 * @param signal - The OS signal that triggered the shutdown (for logging)
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

  // 1. Stop accepting new HTTP connections
  server.close(async () => {
    console.log("🔒 HTTP server closed.");

    try {
      // 2. Close the MongoDB connection pool
      await disconnectDB();
      console.log("✅ Shutdown complete.");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Force exit if shutdown takes longer than 10 seconds
  setTimeout(() => {
    console.error("⏱️  Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10_000);
}

// ─── Process Safety Nets ──────────────────────────────────────────────────────

process.on("unhandledRejection", (reason: unknown) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  // Exit — let the process manager restart cleanly
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // 1. Connect to MongoDB — exits process on failure
  await connectDB();

  // 2. Start listening for HTTP connections
  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on ${env.BACKEND_URL}`);
    console.log(`🌍 Accepting requests from: ${env.FRONTEND_URL}`);
  });

  // 4. Register graceful shutdown handlers
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

main();
