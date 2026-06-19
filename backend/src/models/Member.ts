import { Schema, model, Document } from "mongoose";

// ─── Interface ──────────────────────────────────────────────────────────────

export interface IMember extends Document {
  username: string;
  email: string;
  password?: string;
  role: "crew" | "admin" | "rider";
  strikes?: number;
  name?: string;
  headline?: string;
  bike?: string[];
  avatar?: string;
  coverImage?: string;
  bio?: string;
  years?: number;
  location?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  profileCompleted?: boolean;
  googleConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const MemberSchema = new Schema<IMember>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      min: [3, "Username must be at least 3 characters long"],
      max: [30, "Username cannot exceed 30 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // Never returned in queries unless explicitly requested
    },
    role: {
      type: String,
      enum: ["crew", "admin", "rider"],
      default: "rider",
    },
    // ─── Disciplinary Tracking ────────────────────────────────────────────
    strikes: {
      type: Number,
      default: 0,
      min: 0,
      select: false, // Never returned in queries unless explicitly requested (+strikes)
    },
    // ─── Optional Display Fields ─────────────────────────────────────────
    name: { type: String, trim: true },
    headline: { type: String, trim: true },
    bike: { type: [String] },
    avatar: { type: String },
    coverImage: { type: String },
    bio: { type: String, trim: true },
    years: { type: Number },
    location: { type: String, trim: true },
    instagram: { type: String },
    youtube: { type: String },
    facebook: { type: String },
    googleConnected: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Member = model<IMember>("Member", MemberSchema);
