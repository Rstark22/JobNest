import jwt from "jsonwebtoken";
import Campus from "../models/Campus.js";
import dotenv from "dotenv";
dotenv.config();

export const authCampus = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "campus") return res.status(403).json({ message: "Access denied" });

    req.user = await Campus.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
