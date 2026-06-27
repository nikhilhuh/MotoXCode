import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface IMembershipDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  location: string;
  bike: string;
  experience: string;
  why: string;
  ridden?: string;
  agree: boolean;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const membershipSchema = new Schema<IMembershipDocument>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },
    bike: {
      type: String,
      required: [true, "bike is required"],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
      trim: true,
    },
    why: {
      type: String,
      required: [true, "why is required"],
      trim: true,
    },
    ridden: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    agree: {
      type: Boolean,
      required: [true, "agree is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"] as ApplicationStatus[],
        message: "status must be one of: pending, approved, rejected",
      },
      default: "pending",
    },
  },
  {
    collection: "membership_applications",
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Model
export const MembershipModel: Model<IMembershipDocument> =
  mongoose.model<IMembershipDocument>("Membership", membershipSchema);
