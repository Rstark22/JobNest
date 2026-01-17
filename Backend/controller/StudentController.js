import jwt from "jsonwebtoken";
// import { v2 as cloudinary } from "cloudinary"; // TODO: Install and configure cloudinary
import Student from "../models/Student.js";
import Internship from "../models/Internship.js"
import InternshipApplication from "../models/InternshipApplication.js";

/* =====================================================
   🔐 Generate Token
===================================================== */
const generateToken = (id) => {
    return jwt.sign(
        { id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

/* =====================================================
   👤 GET STUDENT DATA
===================================================== */
export const getStudentData = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, student });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* =====================================================
   📌 APPLY FOR INTERNSHIP
===================================================== */
export const applyForInternship = async (req, res) => {
    try {
        const { internshipId } = req.body;
        const studentId = req.user._id;

        const alreadyApplied = await InternshipApplication.findOne({
            internship: internshipId,
            student: studentId,
        });

        if (alreadyApplied) {
            return res.json({ success: false, message: "Already applied" });
        }

        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.json({ success: false, message: "Internship not found" });
        }

        await InternshipApplication.create({
            internship: internshipId,
            company: internship.company,
            student: studentId,
        });

        res.json({ success: true, message: "Applied successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* =====================================================
   📄 GET APPLIED INTERNSHIPS
===================================================== */
export const getAppliedInternships = async (req, res) => {
    try {
        const applications = await InternshipApplication.find({
            student: req.user._id,
        })
            .populate("company", "name email")
            .populate("internship", "title location duration stipend");

        res.json({
            success: true,
            applications,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* =====================================================
   📎 UPDATE RESUME
===================================================== */
export const updateStudentResume = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        // TODO: Install 'cloudinary' and 'multer' to enable file upload
        /*
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            student.resumeLink = upload.secure_url;
        }
        */

        // Temporary fallback: accept resumeLink from body
        if (req.body.resumeLink) {
            student.resumeLink = req.body.resumeLink;
        }

        await student.save();

        res.json({ success: true, message: "Resume updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};