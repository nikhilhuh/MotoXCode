import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface IPhilosophyDocument extends Document {
  quote: string;
  author: string;
  image: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const philosophySchema = new Schema<IPhilosophyDocument>(
  {
    quote: {
      type: String,
      required: [true, "quote is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "author is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image (Supabase CDN URL) is required"],
    },
  },
  {
    collection: "philosophies",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const PhilosophyModel: Model<IPhilosophyDocument> =
  mongoose.model<IPhilosophyDocument>("Philosophy", philosophySchema);
