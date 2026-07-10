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
  description: string;
  image: string;
  past: boolean;
  attendees: mongoose.Types.ObjectId[];
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
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    past: {
      type: Boolean,
      default: false,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
        default: [],
      },
    ],
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
