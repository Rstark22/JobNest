import Company from "../models/Company.js";
import Internship from "../models/Internship.js";
import InternshipApplication from "../models/InternshipApplication.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (id, role = "company") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/* =====================================================
   🏢 COMPANY REGISTER
===================================================== */
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    // Check existing company
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ message: "Company already registered" });
    }

    // Create company
    const company = await Company.create({ name, email, password, companyName });

    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      companyName: req.body.companyName,
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🔑 COMPANY LOGIN
===================================================== */
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });

    if (!company) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await company.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      companyName: company.companyName,
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📢 POST INTERNSHIP / JOB (Default status: pending)
===================================================== */
export const postInternship = async (req, res) => {
  try {
    const { title, description, stipend, duration, location, requiredSkills } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const internship = await Internship.create({
      title,
      description,
      stipend,
      duration,
      location,
      requiredSkills: requiredSkills || [], // Save skills
      companyName: req.user.companyName,
      status: "pending", // default for Campus verification
    });

    res.status(201).json({
      message: "Internship posted successfully (pending verification)",
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📄 GET COMPANY'S OWN INTERNSHIPS
===================================================== */
export const getCompanyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ companyName: req.user.companyName });
    res.json({ success: true, internships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   GET APPLICANTS FOR AN INTERNSHIP
===================================================== */
export const getInternshipApplicants = async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Check internship belongs to this company
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    if (internship.companyName !== req.user.companyName) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applicants = await InternshipApplication.find({ internship: internshipId })
      .populate("student", "name email department resumeLink")
      .sort({ appliedAt: -1 });

    res.json({ success: true, internship, applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   ✅ UPDATE APPLICATION STATUS (accept/reject)
===================================================== */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await InternshipApplication.findById(applicationId).populate("internship");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.internship.companyName !== req.user.companyName) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
