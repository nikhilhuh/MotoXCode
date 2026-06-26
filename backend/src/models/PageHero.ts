import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export type PageHeroPage =
  | "home"
  | "about"
  | "crew"
  | "rides"
  | "events"
  | "contact"
  | "join";

export interface IPageHero extends Document {
  page: PageHeroPage;
  image: string;
}

// Mongoose Schema
const pageHeroSchema = new Schema<IPageHero>(
  {
    page: {
      type: String,
      required: [true, "page is required"],
      unique: true,
      lowercase: true,
      enum: {
        values: [
          "home",
          "about",
          "crew",
          "rides",
          "events",
          "contact",
          "join",
        ] as PageHeroPage[],
        message:
          "page must be one of: home, about, crew, rides, events, contact, join",
      },
    },
    image: {
      type: String,
      required: [true, "image (Supabase CDN URL) is required"],
    },
  },
  {
    collection: "page_heros",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

// Model
export const PageHeroModel: Model<IPageHero> = mongoose.model<IPageHero>(
  "PageHero",
  pageHeroSchema,
);
