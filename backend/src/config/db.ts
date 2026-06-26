import mongoose from "mongoose";
import { env } from "./env.config";

/**
 * Establishes a Mongoose connection pool to MongoDB.
 * Terminates the process with exit code 1 on connection failure
 * so the process manager (PM2, Docker, etc.) can restart cleanly.
 */
export async function connectDB(): Promise<void> {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);
    console.log(
      `✅ MongoDB connected: ${connection.connection.host} / ${connection.connection.name}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ MongoDB connection failed: ${message}`);
    process.exit(1);
  }
}

/**
 * Gracefully closes the Mongoose connection pool.
 * Called during server shutdown to avoid hanging async tasks.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed.");
}
