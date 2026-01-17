import jwt from "jsonwebtoken";
import Campus from "../models/Campus.js";

const authCampus = async (req, res, next) => {
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

    // 4. Check role
    if (decoded.role !== "campus") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    // 5. Find campus
    const campus = await Campus.findById(decoded.id).select("-password");

    if (!campus) {
      return res
        .status(404)
        .json({ success: false, message: "Campus not found" });
    }

    // 6. Attach campus to request
    req.user = campus;

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};

export default authCampus;
