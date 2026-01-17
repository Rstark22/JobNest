import Internship from "../models/Internship.js";

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
