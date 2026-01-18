import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Campus from "../models/Campus.js";
import authCampus from "../middlewares/authCampus.js";
import {
  getPendingInternships,
  verifyInternship,
  rejectInternship,
  getPendingApplications,
  approveApplication,
  rejectApplication,
} from "../controller/CampusController.js";

dotenv.config();

const CampusRouter = express.Router();

// =====================
// Signup
// =====================
CampusRouter.post("/signup", async (req, res) => {
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
CampusRouter.post("/login", async (req, res) => {
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
CampusRouter.get("/profile", authCampus, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// Campus Dashboard routes
// =====================
CampusRouter.get("/pending", authCampus, getPendingInternships); // view pending internships
CampusRouter.put("/internship/:id/verify", authCampus, verifyInternship); // verify internship
CampusRouter.put("/internship/:id/verify", authCampus, verifyInternship); // verify internship
CampusRouter.put("/internship/:id/reject", authCampus, rejectInternship); // reject internship

// Student Applications
CampusRouter.get("/applications/pending", authCampus, getPendingApplications);
CampusRouter.put("/application/:id/approve", authCampus, approveApplication);
CampusRouter.put("/application/:id/reject", authCampus, rejectApplication);

export default CampusRouter;
