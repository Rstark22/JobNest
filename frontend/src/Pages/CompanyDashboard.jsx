import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CompanyDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    stipend: "",
    duration: "",
    location: "",
  });
  const [myInternships, setMyInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  // Fetch Company's Internships
  const fetchMyInternships = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/internships/my-internships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyInternships(res.data.internships || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Fetch company profile to get the company name (or rely on backend to pull it from token if updated)
      // Note: We updated backend to pull companyName from req.user, but let's send it just in case or rely on backend.
      // Actually backend route now sets companyName from req.user (Step 338+).

      await axios.post(
        `${API_BASE}/api/internships`,
        {
          ...form,
          // companyName is handled by backend now
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Internship Posted! Waiting for Campus Verification ⏳");
      setForm({
        title: "",
        description: "",
        stipend: "",
        duration: "",
        location: "",
      });
      fetchMyInternships(); // Refresh list
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to post internship");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Post Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-2xl font-bold mb-6">Post New Internship</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Internship Title"
            className="w-full border p-3 rounded focus:outline-blue-500"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded focus:outline-blue-500 min-h-[100px]"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              placeholder="Stipend (e.g. 10k/mo)"
              className="w-full border p-3 rounded focus:outline-blue-500"
            />
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration (e.g. 3 Months)"
              className="w-full border p-3 rounded focus:outline-blue-500"
            />
          </div>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g. Remote / Delhi)"
            className="w-full border p-3 rounded focus:outline-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
          >
            Post Internship
          </button>
        </form>
      </div>

      {/* RIGHT: My Internships List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6">My Posted Internships</h2>
        {loading ? (
          <p>Loading...</p>
        ) : myInternships.length === 0 ? (
          <p className="text-gray-500">No internships posted yet.</p>
        ) : (
          <div className="space-y-4">
            {myInternships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white border rounded-lg p-5 shadow-sm flex justify-between items-start"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {internship.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(internship.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{internship.description}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${internship.status === "verified"
                        ? "bg-green-100 text-green-700"
                        : internship.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {internship.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
