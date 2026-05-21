import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface IValueDocument extends Document {
  title: string;
  description: string;
  tag: string;
  image: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const valueSchema = new Schema<IValueDocument>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    tag: {
      type: String,
      required: [true, "tag is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image (Supabase CDN URL) is required"],
    },
  },
  {
    collection: "values",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const ValueModel: Model<IValueDocument> = mongoose.model<IValueDocument>(
  "Value",
  valueSchema
);
