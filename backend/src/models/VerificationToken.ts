import { Schema, model, Document } from "mongoose";

// Interface
export interface IVerificationToken extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

// Schema
const VerificationTokenSchema = new Schema<IVerificationToken>({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  expiresAt: {
    type: Date,
    required: true,
    /**
     * Native MongoDB TTL index.
     * Documents are automatically removed by MongoDB
     * once `expiresAt` is in the past.
     * expireAfterSeconds: 0 means "delete at the time stored in expiresAt".
     */
    index: { expires: 0 },
  },
});

// Ensure only one OTP token per email at a time
VerificationTokenSchema.index({ email: 1 }, { unique: true });

// Model
export const VerificationToken = model<IVerificationToken>(
  "VerificationToken",
  VerificationTokenSchema
);
