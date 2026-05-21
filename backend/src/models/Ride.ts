import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export type RouteType = "Inter-state" | "Inter-city" | "Intra-city";

export interface IRideDocument extends Document {
  title: string;
  location: {
    from: string;
    to: string;
  };
  date: string;
  distance: string;
  routeType: RouteType;
  image: string;
  meetupTime: string;
  meetupLocation: string;
  membersJoined: number;
  description: string;
  duration: string;
  past: boolean;
}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const rideSchema = new Schema<IRideDocument>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    location: {
      from: {
        type: String,
        required: [true, "location.from is required"],
        trim: true,
      },
      to: {
        type: String,
        required: [true, "location.to is required"],
        trim: true,
      },
    },
    date: {
      type: String,
      required: [true, "date is required"],
    },
    distance: {
      type: String,
      required: [true, "distance is required"],
    },
    routeType: {
      type: String,
      required: [true, "routeType is required"],
      enum: {
        values: ["Inter-state", "Inter-city", "Intra-city"] as RouteType[],
        message: "routeType must be one of: Inter-state, Inter-city, Intra-city",
      },
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    meetupTime: {
      type: String,
      required: [true, "meetupTime is required"],
    },
    meetupLocation: {
      type: String,
      required: [true, "meetupLocation is required"],
      trim: true,
    },
    membersJoined: {
      type: Number,
      default: 0,
      min: [0, "membersJoined cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
    },
    past: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "rides",
    // Expose virtual 'id' (string) alongside '_id' for seamless alignment
    // with frontend interfaces that use { id: string } instead of { _id: ObjectId }.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const RideModel: Model<IRideDocument> = mongoose.model<IRideDocument>(
  "Ride",
  rideSchema
);
