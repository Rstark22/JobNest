import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import studentRoutes from "./routes/student.js";
import companyRoutes from "./routes/company.js";
import campusRoutes from "./routes/campus.js";
import internshipRoutes from "./routes/internship.js";
import connectDB from "./config/mongodb.js";



dotenv.config();

const app = express();
console.log("SERVER.JS: Active and Modified by Agent (Step 312)");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log("Mounting student routes...");
app.use("/api/student", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/campus", campusRoutes);
app.use("/api/internships", internshipRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Welcome to Internship Portal Backend API");
});

connectDB();

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
