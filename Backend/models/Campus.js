import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CampusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  campusName: { type: String }, // Optional field
}, { timestamps: true });

// Hash password before saving
CampusSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
CampusSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Campus", CampusSchema);
