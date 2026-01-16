import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  resumeLink: { type: String },
  password: { type: String, required: true },
});

// Hash password before save
StudentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match
StudentSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Student", StudentSchema);
