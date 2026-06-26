import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export interface IContactInfoDocument extends Document {
  label: string;
  value: string;
  type: string;
}

// Mongoose Schema
const contactInfoSchema = new Schema<IContactInfoDocument>(
  {
    label: {
      type: String,
      required: [true, "label is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "value is required"],
      trim: true,
    },
    type: {
      type: String,
      default: "text",
      trim: true,
    },
  },
  {
    collection: "contact_info_items",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

// Model
export const ContactInfoModel: Model<IContactInfoDocument> =
  mongoose.model<IContactInfoDocument>("ContactInfo", contactInfoSchema);
