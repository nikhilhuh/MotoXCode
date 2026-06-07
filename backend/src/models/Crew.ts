import { Schema, model, Document } from "mongoose";

// ─── Interface ──────────────────────────────────────────────────────────────

export interface ICrew extends Document {
  username: string;
  email: string;
  password?: string;
  role: "crew" | "admin" | "rider";
  isVerified: boolean;
  /** Optional display-layer fields populated after full profile setup */
  name?: string;
  bike?: string;
  image?: string;
  bio?: string;
  years?: number;
  location?: string;
  instagram?: string;
  whatsapp?: string;
  mvp?: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const CrewSchema = new Schema<ICrew>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
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
      default: "crew",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // ─── Optional Display Fields ─────────────────────────────────────────
    name: { type: String, trim: true },
    bike: { type: String, trim: true },
    image: { type: String },
    bio: { type: String },
    years: { type: Number },
    location: { type: String, trim: true },
    instagram: { type: String },
    whatsapp: { type: String },
    mvp: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Crew = model<ICrew>("Crew", CrewSchema);
