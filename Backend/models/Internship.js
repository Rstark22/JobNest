import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true }, // ⚠ required
  description: { type: String, required: true },
  stipend: { type: String },
  duration: { type: String },
  location: { type: String },
});

export default mongoose.model("Internship", internshipSchema);
