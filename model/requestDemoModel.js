import mongoose from "mongoose";

const requestDemoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const RequestDemo = mongoose.model("RequestDemo", requestDemoSchema);