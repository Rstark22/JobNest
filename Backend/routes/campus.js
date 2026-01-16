// routes/campus.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Campus from "../models/Campus.js";
import { authCampus } from "../middlewares/authCampus.js";

dotenv.config();

const router = express.Router();

// =====================
// Signup
// =====================
router.post("/signup", async (req, res) => {
  const { name, email, password, campusName } = req.body;
  try {
    const exist = await Campus.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const campus = await Campus.create({ name, email, password, campusName });

    const token = jwt.sign(
      { id: campus._id, role: "campus" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, campus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// Login
// =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const campus = await Campus.findOne({ email });
    if (!campus) return res.status(400).json({ message: "User not found" });

    const isMatch = await campus.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: campus._id, role: "campus" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, campus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// Protected profile route
// =====================
router.get("/profile", authCampus, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
