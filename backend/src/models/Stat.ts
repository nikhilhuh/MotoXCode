import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface IStatDocument extends Document {
  target: number;
  suffix: string;
  label: string;
  image: string;
  isFloat: boolean;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const statSchema = new Schema<IStatDocument>(
  {
    target: {
      type: Number,
      required: [true, "target is required"],
    },
    suffix: {
      type: String,
      required: [true, "suffix is required"],
      trim: true,
    },
    label: {
      type: String,
      required: [true, "label is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image (Supabase CDN URL) is required"],
    },
    isFloat: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "stats",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const StatModel: Model<IStatDocument> = mongoose.model<IStatDocument>(
  "Stat",
  statSchema
);
