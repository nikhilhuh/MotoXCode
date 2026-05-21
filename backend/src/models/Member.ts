import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface IMemberDocument extends Document {
  name: string;
  role: string;
  bike: string;
  image: string;
  bio: string;
  years: number;
  location: string;
  instagram?: string;
  whatsapp?: string;
  mvp: boolean;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const memberSchema = new Schema<IMemberDocument>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      trim: true,
    },
    bike: {
      type: String,
      required: [true, "bike is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    bio: {
      type: String,
      required: [true, "bio is required"],
      trim: true,
    },
    years: {
      type: Number,
      required: [true, "years is required"],
      min: [0, "years cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    mvp: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "members",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const MemberModel: Model<IMemberDocument> = mongoose.model<IMemberDocument>(
  "Member",
  memberSchema
);
