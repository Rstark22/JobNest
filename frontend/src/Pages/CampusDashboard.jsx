import React, { useEffect, useState } from "react";
import axios from "axios";

const CampusDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const API_BASE = "http://localhost:5000";

  // ==========================
  // Fetch Pending Internships
  // ==========================
  const fetchPendingInternships = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("campusToken");
      if (!token) {
        alert("Campus not logged in");
        return;
      }

      const res = await axios.get(
        `${API_BASE}/api/campus/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🛡️ SAFE CHECK
      setInternships(Array.isArray(res.data.internships) ? res.data.internships : []);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      alert("Failed to fetch pending internships");
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingInternships();
  }, []);

  // ==========================
  // Verify / Reject Internship
  // ==========================
  const updateStatus = async (id, status) => {
    try {
      setActionId(id);
      const token = localStorage.getItem("campusToken");
      const action = status === "verified" ? "verify" : "reject";

      await axios.put(
        `${API_BASE}/api/campus/internship/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPendingInternships();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  // ==========================
  // UI
  // ==========================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        Loading pending internships...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Campus Internship Verification
      </h1>

      {internships.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No pending internships found ✅
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="border rounded-xl p-5 shadow-md hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {internship.title}
              </h2>

              <p className="text-gray-700 mb-1">
                <strong>Company:</strong> {internship.companyName}
              </p>

              <p className="text-gray-700 mb-1">
                <strong>Location:</strong> {internship.location || "N/A"}
              </p>

              <p className="text-gray-700 mb-2">
                <strong>Stipend:</strong> {internship.stipend || "N/A"}
              </p>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {internship.description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(internship._id, "verified")}
                  disabled={actionId === internship._id}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Verify
                </button>

                <button
                  onClick={() => updateStatus(internship._id, "rejected")}
                  disabled={actionId === internship._id}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusDashboard;
