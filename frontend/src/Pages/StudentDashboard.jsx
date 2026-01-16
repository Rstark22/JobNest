// StudentDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "profile":
        return <ProfileTab />;
      case "academics":
        return <AcademicsTab />;
      case "skills":
        return <SkillsTab />;
      case "projects":
        return <ProjectsTab />;
      case "certifications":
        return <CertificationsTab />;
      case "resume":
        return <ResumeTab />;
      case "internships":
        return <InternshipTab />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5">
        <h1 className="text-xl font-bold mb-5">Student Dashboard</h1>
        <nav className="flex flex-col gap-2">
          {[
            { name: "Home", key: "home" },
            { name: "Profile", key: "profile" },
            { name: "Academics", key: "academics" },
            { name: "Skills", key: "skills" },
            { name: "Projects", key: "projects" },
            { name: "Certifications", key: "certifications" },
            { name: "Resume", key: "resume" },
            { name: "Internship Openings", key: "internships" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`text-left p-2 rounded hover:bg-gray-200 ${
                activeTab === tab.key ? "bg-gray-300 font-semibold" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

// ------------------- Home -------------------
const Home = () => {
  const { profile } = useContext(AuthContext);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {profile?.name || "Student"}
      </h2>
      <p>Profile completeness: 70%</p>
      <p>Recent activities: Applied to 3 jobs, 2 certifications earned</p>
    </div>
  );
};

// ------------------- Profile -------------------
const ProfileTab = () => {
  const { profile, updateProfile } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    resumeLink: "",
  });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/student/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateProfile(form);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      <form className="space-y-3 max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="resumeLink"
          value={form.resumeLink}
          onChange={handleChange}
          placeholder="Resume Link"
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

// ------------------- Internship Tab -------------------
const InternshipTab = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/internships");
        setInternships(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load internships");
      }
    };
    fetchInternships();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Internships</h2>
      {internships.length === 0 ? (
        <p>No internships available right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internships.map((i) => (
            <div
              key={i._id}
              className="bg-white shadow p-4 rounded border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{i.title}</h3>
              <p className="text-gray-600">{i.company?.name}</p>
              <p className="mt-2">{i.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Location: {i.location}
              </p>
              <p className="text-sm text-gray-500">Stipend: {i.stipend}</p>
              <p className="text-sm text-gray-500">Duration: {i.duration}</p>
              <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
