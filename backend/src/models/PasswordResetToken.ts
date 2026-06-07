import { Schema, model, Document } from "mongoose";

// ─── Interface ──────────────────────────────────────────────────────────────

export interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  createdAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    index: true,
  },
  token: {
    type: String,
    required: [true, "Token hash is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    /**
     * Native MongoDB TTL index.
     * Documents are automatically removed by MongoDB
     * after 900 seconds (15 minutes).
     */
    index: { expires: 900 },
  },
});

export const PasswordResetToken = model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
