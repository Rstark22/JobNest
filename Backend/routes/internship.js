import express from "express";
import authCompany from "../middlewares/authCompany.js";
import Internship from "../models/Internship.js"; // Explicit Re-Import
import InternshipApplication from "../models/InternshipApplication.js";
const router = express.Router();

/* =====================================================
   📌 POST INTERNSHIP (Company only)
===================================================== */
console.log("INTERNSHIP.JS: Module Loaded & Fix Active (Step 312)");

router.post("/", authCompany, async (req, res) => {
  console.log("Internship POST route hit. Body:", req.body);
  try {
    const { title, description, stipend, duration, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const internship = await Internship.create({
      title,
      description,
      stipend,
      duration,
      location,
      company: req.user._id, // company reference
      companyName: req.user.companyName,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Internship posted successfully",
      internship,
    });
  } catch (error) {
    console.error("Post Internship Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to post internship",
    });
  }
});

/* =====================================================
   📌 GET ALL INTERNSHIPS (Public/Student)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find({ status: "verified" })
      .populate("company", "name email companyName") // Populate company details
      .sort({ createdAt: -1 });

    res.status(200).json(internships);
  } catch (error) {
    console.error("Get All Internships Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch internships",
    });
  }
});

/* =====================================================
   📌 GET LOGGED-IN COMPANY INTERNSHIPS
===================================================== */
router.get("/my-internships", authCompany, async (req, res) => {
  try {
    const internships = await Internship.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error("Get Company Internships Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch internships",
    });
  }
});

/* =====================================================
   📌 DELETE INTERNSHIP (Only Owner Company)
===================================================== */
router.delete("/internship/:id", authCompany, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    // ownership check
    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    console.error("Delete Internship Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete internship",
    });
  }
});

export default router;
