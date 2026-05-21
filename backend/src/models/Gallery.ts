import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export type GalleryPageType = "home" | "rides" | "events" | "join";

export interface IGalleryDocument extends Document {
  src: string;
  title: string;
  page: GalleryPageType;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const gallerySchema = new Schema<IGalleryDocument>(
  {
    src: {
      type: String,
      required: [true, "src is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    page: {
      type: String,
      required: [true, "page is required"],
      enum: {
        values: ["home", "rides", "events", "join"] as GalleryPageType[],
        message: "page must be one of: home, rides, events, join",
      },
    },
  },
  {
    collection: "gallery_images",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const GalleryModel: Model<IGalleryDocument> = mongoose.model<IGalleryDocument>(
  "Gallery",
  gallerySchema
);
