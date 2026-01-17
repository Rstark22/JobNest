import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

const authCompany = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AuthCompany Decoded:", decoded);

    // 4. Check role
    if (decoded.role !== "company") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    // 5. Find company
    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // 6. Attach company to request
    req.user = company;

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};

export default authCompany;
