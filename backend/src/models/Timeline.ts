import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export interface ITimelineDocument extends Document {
  year: string;
  location: string;
  event: string;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const timelineSchema = new Schema<ITimelineDocument>(
  {
    year: {
      type: String,
      required: [true, "year is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },
    event: {
      type: String,
      required: [true, "event is required"],
      trim: true,
    },
  },
  {
    collection: "timelines",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const TimelineModel: Model<ITimelineDocument> =
  mongoose.model<ITimelineDocument>("Timeline", timelineSchema);
