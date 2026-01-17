import express from "express";
//import upload from "../middleware/multer.js"; // For profile image (if needed)
import authCompany from "../middlewares/authCompany.js";

import {
  registerCompany,
  loginCompany,
  postInternship,
  getCompanyInternships
} from "../controller/CompanyController.js";

const companyRoute = express.Router();

// =====================
// Company Auth
// =====================
companyRoute.post("/register", registerCompany);
companyRoute.post("/login", loginCompany);

// =====================
// Protected routes (JWT + Role) 
// =====================
companyRoute.get("/profile", authCompany, (req, res) => {
  res.status(200).json({ success: true, company: req.user });
});

// =====================
// Internship / Job Routes
// =====================
companyRoute.post("/post-internship", authCompany, postInternship);
companyRoute.get("/my-internships", authCompany, getCompanyInternships);
//companyRoute.post("/change-visibility", authCompany, changeInternshipVisibility);

export default companyRoute;
