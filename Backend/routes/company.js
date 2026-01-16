// routes/company.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import { authCompany } from "../middlewares/authCompany.js";

dotenv.config();

const router = express.Router();

// =====================
// Signup
// =====================
router.post("/signup", async (req, res) => {
  const { name, email, password, companyName } = req.body;
  try {
    const exist = await Company.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const company = await Company.create({ name, email, password, companyName });

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, company });
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
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ message: "User not found" });

    const isMatch = await company.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// Protected profile route
// =====================
router.get("/profile", authCompany, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
