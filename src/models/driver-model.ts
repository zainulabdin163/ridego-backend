import mongoose, { Document, Schema } from "mongoose";

export interface IDriver extends Document {
  user: mongoose.Schema.Types.ObjectId;
  licenseNumber: string;
  vehicle: mongoose.Schema.Types.ObjectId;
  status: "available" | "busy" | "offline";
  location?: {
    type: { type: String; enum: ["Point"]; required: true };
    coordinates: { type: [Number]; required: true };
  };
}

const driverSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  licenseNumber: { type: String, required: true, unique: true },

  vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },

  status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "offline",
  },

  location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number] },
  },
});

driverSchema.index({ location: "2dsphere" });

export default mongoose.model<IDriver>("Driver", driverSchema);
