import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface ISocialDocument extends Document {
  label: string;
  link: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const socialSchema = new Schema<ISocialDocument>(
  {
    label: {
      type: String,
      required: [true, "label is required"],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "link is required"],
      trim: true,
    },
  },
  {
    collection: "socials",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const SocialModel: Model<ISocialDocument> = mongoose.model<ISocialDocument>(
  "Social",
  socialSchema
);
