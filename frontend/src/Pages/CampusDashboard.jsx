import React, { useEffect, useState } from "react";
import axios from "axios";

const CampusDashboard = () => {
  // ==========================
  // State
  // ==========================
  const [activeTab, setActiveTab] = useState("internships"); // 'internships' | 'applications'
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]); // Student applications
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const API_BASE = "http://localhost:5000";

  // ==========================
  // Fetch Data
  // ==========================
  const fetchPendinginternships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("campusToken");
      const res = await axios.get(`${API_BASE}/api/campus/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships(res.data.internships || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("campusToken");
      const res = await axios.get(`${API_BASE}/api/campus/applications/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "internships") fetchPendinginternships();
    if (activeTab === "applications") fetchPendingApplications();
  }, [activeTab]);

  // ==========================
  // Actions
  // ==========================
  const updateInternshipStatus = async (id, status) => {
    try {
      setActionId(id);
      const token = localStorage.getItem("campusToken");
      const action = status === "verified" ? "verify" : "reject";
      await axios.put(`${API_BASE}/api/campus/internship/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendinginternships();
    } catch (error) { alert("Failed"); } finally { setActionId(null); }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      setActionId(id);
      const token = localStorage.getItem("campusToken");
      const action = status === "approved" ? "approve" : "reject";
      await axios.put(`${API_BASE}/api/campus/application/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendingApplications();
    } catch (error) { alert("Failed"); } finally { setActionId(null); }
  };

  // ==========================
  // Render
  // ==========================
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Campus Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("internships")}
          className={`px-6 py-2 rounded-full font-semibold ${activeTab === "internships"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Verify Internships
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-2 rounded-full font-semibold ${activeTab === "applications"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Verify Student Applications
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && activeTab === "internships" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length === 0 && <p className="text-center col-span-3">No pending internships.</p>}
          {internships.map((internship) => (
            <div key={internship._id} className="border p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">{internship.title}</h3>
              <p className="text-gray-600 mb-4">{internship.companyName}</p>
              <div className="flex gap-2">
                <button onClick={() => updateInternshipStatus(internship._id, "verified")} className="flex-1 bg-green-500 text-white py-2 rounded">Verify</button>
                <button onClick={() => updateInternshipStatus(internship._id, "rejected")} className="flex-1 bg-red-500 text-white py-2 rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "applications" && (
        <div className="space-y-4">
          {applications.length === 0 && <p className="text-center">No pending student applications.</p>}
          {applications.map((app) => (
            <div key={app._id} className="border p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold">{app.student?.name}</h3>
                <p className="text-gray-600">{app.student?.email} • {app.student?.department}</p>
                <p className="text-blue-600 mt-1">Applying for: <strong>{app.internship?.title}</strong> ({app.internship?.companyName})</p>
                {app.student?.resumeLink && (
                  <a href={app.student.resumeLink} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm block mt-1 hover:text-blue-700">View Resume</a>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateApplicationStatus(app._id, "approved")} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Approve</button>
                <button onClick={() => updateApplicationStatus(app._id, "rejected")} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusDashboard;
