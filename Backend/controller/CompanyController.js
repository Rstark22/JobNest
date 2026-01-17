import Company from "../models/Company.js";
import Internship from "../models/Internship.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (id, role = "company") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
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
    const company = await Company.create({
      name,
      email,
      password,
      companyName,
    });

    res.status(201).json({
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
   🔑 COMPANY LOGIN
===================================================== */
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

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
   📢 POST INTERNSHIP / JOB
===================================================== */
export const postInternship = async (req, res) => {
  try {
    const { title, description, stipend, duration, location } = req.body;

    const internship = await Internship.create({
      title,
      description,
      stipend,
      duration,
      location,
      companyName: req.user.companyName, // from auth middleware
    });

    res.status(201).json({
      message: "Internship posted successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📄 GET COMPANY'S OWN POSTS
===================================================== */
export const getCompanyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      companyName: req.user.companyName,
    });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
