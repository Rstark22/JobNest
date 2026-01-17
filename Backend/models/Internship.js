import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stipend: String,
    duration: String,
    location: String,

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true, // we can keep this, but controller logic might need adjustment if it relies ONLY on companyName
    },
    companyName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
