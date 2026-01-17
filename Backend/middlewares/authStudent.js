import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const authStudent = async (req, res, next) => {
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
    if (decoded.role !== "student") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    // 5. Find student
    const student = await Student.findById(decoded.id).select("-password");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // 6. Attach student to request
    req.user = student;

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};

export default authStudent;
