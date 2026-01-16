import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CompanyDashboard() {
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    stipend: "",
    duration: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    // Fetch company profile to get the company name
    const profileRes = await axios.get("http://localhost:5000/api/company/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const companyName = profileRes.data.name;

    // Post internship with companyName included
    await axios.post(
      "http://localhost:5000/api/internships",
      {
        title: form.title,
        companyName, // required field
        description: form.description,
        stipend: form.stipend,
        duration: form.duration,
        location: form.location,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Internship posted successfully!");
    setForm({
      title: "",
      description: "",
      stipend: "",
      duration: "",
      location: "",
    });

  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to post internship");
  }
};
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Post Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Internship Title"
          className="border p-2 rounded w-full"
        />
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
        />
        <input
          name="stipend"
          value={form.stipend}
          onChange={handleChange}
          placeholder="Stipend"
          className="border p-2 rounded w-full"
        />
        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration"
          className="border p-2 rounded w-full"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Internship
        </button>
      </form>
    </div>
  );
}
