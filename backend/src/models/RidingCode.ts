import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface IRidingCodeDocument extends Document {
  rule: string;
  detail: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const ridingCodeSchema = new Schema<IRidingCodeDocument>(
  {
    rule: {
      type: String,
      required: [true, "rule is required"],
      trim: true,
    },
    detail: {
      type: String,
      required: [true, "detail is required"],
      trim: true,
    },
  },
  {
    collection: "riding_codes",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const RidingCodeModel: Model<IRidingCodeDocument> =
  mongoose.model<IRidingCodeDocument>("RidingCode", ridingCodeSchema);
