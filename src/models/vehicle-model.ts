import mongoose, { Document, Schema } from "mongoose";

export interface IVehicle extends Document {
  make: string;
  modelDetail: string;
  year: number;
  color: string;
  licensePlate: string;
}

const vehicleSchema = new Schema({
  make: { type: String, required: true },

  modelDetail: { type: String, required: true },

  year: { type: Number, required: true },

  color: { type: String, required: true },

  licensePlate: { type: String, required: true, unique: true },
});

export default mongoose.model<IVehicle>("Vehicle", vehicleSchema);
