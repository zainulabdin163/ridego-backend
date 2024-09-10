import mongoose, { Document, Schema } from "mongoose";

export interface IRide extends Document {
  rider: mongoose.Schema.Types.ObjectId;
  driver: mongoose.Schema.Types.ObjectId;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "completed" | "canceled";
  startTime: Date;
  endTime?: Date;
  fare?: number;
}

const rideSchema = new Schema({
  rider: { type: Schema.Types.ObjectId, ref: "User", required: true },

  driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },

  pickupLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  dropoffLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "canceled"],
    default: "pending",
  },

  startTime: { type: Date, required: true },

  endTime: { type: Date },

  fare: { type: Number },
});

export default mongoose.model<IRide>("Ride", rideSchema);
