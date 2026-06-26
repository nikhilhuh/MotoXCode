import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export interface IContactDocument extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "pending" | "completed";
}

// Mongoose Schema
const contactSchema = new Schema<IContactDocument>(
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
    subject: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "status is required"],
      trim: true,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    collection: "contact_requests",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Model
export const ContactModel: Model<IContactDocument> =
  mongoose.model<IContactDocument>("Contact", contactSchema);
