import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import authStudent from "../middlewares/authStudent.js"

dotenv.config();
const router = express.Router();

// Signup
router.post("/register", async (req, res) => {
  console.log("Student register route hit");
  const { name, email, department, resumeLink, password } = req.body;
  try {
    const exist = await Student.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const student = await Student.create({ name, email, department, resumeLink, password });

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ token, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "User not found" });

    const isMatch = await student.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get("/profile", authStudent, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put("/profile", authStudent, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
