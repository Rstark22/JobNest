// middlewares/authCompany.js
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import dotenv from "dotenv";

dotenv.config();

export const authCompany = async (req, res, next) => {
  try {
    // 1. Get token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check role
    if (decoded.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 4. Attach company data to request
    req.user = await Company.findById(decoded.id).select("-password");
    if (!req.user) return res.status(404).json({ message: "Company not found" });

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
