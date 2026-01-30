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
      case "recommended":
        return <RecommendedTab />;
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
            { name: "Recommended Jobs", key: "recommended" }, // New
            { name: "Academics", key: "academics" },
            { name: "Skills", key: "skills" },
            { name: "Projects", key: "projects" },
            { name: "Certifications", key: "certifications" },
            { name: "Resume", key: "resume" },
            { name: "Internship Openings", key: "internships" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`text-left p-2 rounded hover:bg-gray-200 ${activeTab === tab.key ? "bg-gray-300 font-semibold" : ""
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
      <p>Profile completeness: {profile?.skills?.length > 0 ? "80%" : "40%"}</p>
      <p>Your Skills: {profile?.skills?.join(", ") || "None added yet"}</p>
    </div>
  );
};

// ------------------- Profile -------------------
const ProfileTab = () => {
  const { profile, setProfile } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    resumeLink: "",
    skills: "", // Comma separated string for input
  });

  useEffect(() => {
    if (profile) {
      setForm({
        ...profile,
        skills: profile.skills ? profile.skills.join(", ") : "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = form.skills.split(",").map(s => s.trim()).filter(Boolean);

      // Sanitize payload: Remove _id, password, timestamps
      const { _id, password, createdAt, updatedAt, __v, ...safeData } = form;
      const updateData = { ...safeData, skills: skillsArray };

      const token = localStorage.getItem("studentToken"); // Use specific token
      await axios.put("http://localhost:5000/api/student/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local context without triggering another API call
      setProfile({ ...profile, ...updateData });
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      <form className="space-y-3 max-w-md" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded w-full" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="border p-2 rounded w-full" />
        <input name="resumeLink" value={form.resumeLink} onChange={handleChange} placeholder="Resume Link" className="border p-2 rounded w-full" />

        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (Comma Separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node, Python"
            className="border p-2 rounded w-full"
          />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

//skillsTab.jsx
const SkillsTab = () => {
  const { profile, setProfile } = useContext(AuthContext);
  const [skill, setSkill] = useState("");

  const addSkill = async () => {
    if (!skill) return;

    const updatedSkills = [...(profile.skills || []), skill];

    try {
      const token = localStorage.getItem("studentToken");
      await axios.put(
        "http://localhost:5000/api/student/profile",
        { skills: updatedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile({ ...profile, skills: updatedSkills });
      setSkill("");
      toast.success("Skill added successfully");
    } catch (err) {
      toast.error("Failed to add skill");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Skills</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter skill"
          className="border p-2 rounded"
        />
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {profile?.skills?.map((s, i) => (
          <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};


//AcademicsTab.jsx
const AcademicsTab = () => {
  const { profile, setProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    department: "",
    university: "",
    cgpa: "",
    graduationYear: "",
  });

  const [editing, setEditing] = useState(false);

  // 🔹 Pre-fill academic data
  useEffect(() => {
    if (profile) {
      setFormData({
        department: profile.department || "",
        university: profile.university || "",
        cgpa: profile.cgpa || "",
        graduationYear: profile.graduationYear || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("studentToken");

      await axios.put(
        "http://localhost:5000/api/student/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔹 Update context instantly
      setProfile({ ...profile, ...formData });

      toast.success("Academic details updated successfully 🎓");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update academic details");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Academic Details</h2>

      {!editing ? (
        <>
          <div className="space-y-2 text-lg">
            <p><b>Department:</b> {profile?.department || "N/A"}</p>
            <p><b>University:</b> {profile?.university || "N/A"}</p>
            <p><b>CGPA:</b> {profile?.cgpa || "N/A"}</p>
            <p><b>Graduation Year:</b> {profile?.graduationYear || "N/A"}</p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Academics
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-3 max-w-md">
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="University"
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            placeholder="CGPA"
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="Graduation Year"
            className="border p-2 rounded w-full"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ------------------- Projects Tab -------------------
const ProjectsTab = () => {
  const { profile } = useContext(AuthContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      {profile?.projects?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {profile.projects.map((p, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-600">{p.description}</p>
              <a
                href={p.link}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects added</p>
      )}
    </div>
  );
};

// ------------------- Certifications Tab -------------------
const CertificationsTab = () => {
  const { profile } = useContext(AuthContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Certifications</h2>

      {profile?.certifications?.length ? (
        <ul className="list-disc pl-6 space-y-2">
          {profile.certifications.map((c, i) => (
            <li key={i}>
              <b>{c.name}</b> – {c.platform}
            </li>
          ))}
        </ul>
      ) : (
        <p>No certifications added</p>
      )}
    </div>
  );
};

// ------------------- Resume Tab -------------------
const ResumeTab = () => {
  const { profile } = useContext(AuthContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resume</h2>

      {profile?.resumeLink ? (
        <a
          href={profile.resumeLink}
          target="_blank"
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          View Resume
        </a>
      ) : (
        <p>No resume uploaded</p>
      )}
    </div>
  );
};

// ------------------- Recommended Tab -------------------
const RecommendedTab = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const res = await axios.get("http://localhost:5000/api/student/recommendations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInternships(res.data.recommended || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  if (loading) return <p>Loading recommendations...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      {internships.length === 0 ? <p>No recommendations yet. Add some skills!</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internships.map(i => (
            <div key={i._id} className="bg-indigo-50 border-indigo-200 border p-4 rounded shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-indigo-900">{i.title}</h3>
                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{i.matchScore} Matches</span>
              </div>
              <p className="text-gray-600">{i.companyName}</p>
              <div className="my-2">
                <p className="text-sm font-semibold">Matched Skills:</p>
                <p className="text-sm text-green-700">{i.requiredSkills?.filter(s => i.missingSkills?.every(m => m !== s)).join(", ")}</p>
              </div>
              <button className="mt-2 w-full bg-indigo-600 text-white py-1 rounded">View & Apply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------- Internship Tab -------------------
const InternshipTab = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/internships");
        setInternships(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load internships");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const handleApply = async (internshipId) => {
    try {
      setApplyingId(internshipId);
      const token = localStorage.getItem("studentToken");
      if (!token) {
        toast.error("Please login as student first");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/student/apply",
        { internshipId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Applied Successfully! Waiting for Campus Approval 🎓");
      } else {
        toast.info(res.data.message); // e.g. "Already applied"
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <p className="text-center p-4">Loading internships...</p>;

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
              className="bg-white shadow p-4 rounded border hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{i.title}</h3>
                <p className="text-gray-600 font-medium">{i.company?.companyName || i.companyName}</p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {i.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>

                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>📍 Location: {i.location || "Remote"}</p>
                  <p>💰 Stipend: {i.stipend || "Unpaid"}</p>
                  <p>⏳ Duration: {i.duration || "N/A"}</p>
                </div>
              </div>
              <button
                onClick={() => handleApply(i._id)}
                disabled={applyingId === i._id}
                className="mt-4 w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {applyingId === i._id ? "Applying..." : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
