import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export type EventType = "Ride" | "Meetup" | "Workshop" | "Social";

export interface IEventDocument extends Document {
  date: string;
  title: string;
  location: string;
  type: EventType;
  time: string;
  spots: number;
  spotsLeft: number;
}

// Mongoose Schema
const eventSchema = new Schema<IEventDocument>(
  {
    date: {
      type: String,
      required: [true, "date is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "type is required"],
      enum: {
        values: ["Ride", "Meetup", "Workshop", "Social"] as EventType[],
        message: "type must be one of: Ride, Meetup, Workshop, Social",
      },
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    spots: {
      type: Number,
      required: [true, "spots is required"],
      min: [1, "spots must be at least 1"],
    },
    spotsLeft: {
      type: Number,
      required: [true, "spotsLeft is required"],
      min: [0, "spotsLeft cannot be negative"],
    },
  },
  {
    collection: "events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Model
export const EventModel: Model<IEventDocument> = mongoose.model<IEventDocument>(
  "Event",
  eventSchema
);
