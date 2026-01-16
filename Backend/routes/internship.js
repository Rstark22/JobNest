import express from "express";
import { authCompany } from "../middlewares/authCompany.js";
import Internship from "../models/Internship.js";

const router = express.Router();

// Protected route: Only company can post internships
router.post("/internships", authCompany, async (req, res) => {
  try {
    const { title, description, stipend, duration, location } = req.body;

    const internship = await Internship.create({
      title,
      description,
      stipend,
      duration,
      location,
      company: req.user._id, // attach company
    });

    res.status(201).json({ internship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post internship" });
  }
});

export default router;
