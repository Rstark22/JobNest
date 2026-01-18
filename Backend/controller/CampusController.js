import Internship from "../models/Internship.js";
import InternshipApplication from "../models/InternshipApplication.js";

/* =====================================================
   GET PENDING INTERNSHIPS
===================================================== */
export const getPendingInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ status: "pending" })
            .populate("company", "name email companyName");
        res.json({ success: true, internships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =====================================================
   VERIFY INTERNSHIP
===================================================== */
export const verifyInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = await Internship.findById(id);
        if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

        internship.status = "verified";
        await internship.save();

        res.json({ success: true, message: "Internship verified", internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =====================================================
   REJECT INTERNSHIP
===================================================== */
export const rejectInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = await Internship.findById(id);
        if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

        internship.status = "rejected";
        await internship.save();

        res.json({ success: true, message: "Internship rejected", internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =====================================================
   GET PENDING APPLICATIONS (Students applying to Companies)
===================================================== */
export const getPendingApplications = async (req, res) => {
    try {
        const applications = await InternshipApplication.find({ campusApproval: "pending" })
            .populate("student", "name email department resumeLink")
            .populate("internship", "title companyName")
            .sort({ appliedAt: -1 });

        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =====================================================
   APPROVE STUDENT APPLICATION
===================================================== */
export const approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await InternshipApplication.findById(id);
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });

        application.campusApproval = "approved";
        await application.save();

        res.json({ success: true, message: "Application approved", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =====================================================
   REJECT STUDENT APPLICATION
===================================================== */
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await InternshipApplication.findById(id);
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });

        application.campusApproval = "rejected";
        application.status = "rejected"; // Auto-reject for company too
        await application.save();

        res.json({ success: true, message: "Application rejected", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
