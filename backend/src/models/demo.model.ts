import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

/**
 * Represents a single document in the 'DemoCollection' MongoDB collection.
 * Extends mongoose.Document to include Mongoose instance methods and metadata.
 */
export interface IDemoDocument extends Document {
  rollNo: number;
  name: string;
  age: number;
  course: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const demoSchema = new Schema<IDemoDocument>(
  {
    rollNo: {
      type: Number,
      required: [true, "rollNo is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
      min: [0, "age must be non-negative"],
    },
    course: {
      type: String,
      required: [true, "course is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "DemoCollection", // Explicit collection name — avoids Mongoose pluralization
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

/**
 * Typed Mongoose model for the DemoCollection.
 * Import this in services — never access it directly from controllers or routes.
 */
export const DemoModel: Model<IDemoDocument> = mongoose.model<IDemoDocument>(
  "DemoCollection",
  demoSchema
);
