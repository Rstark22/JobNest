import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    resumeLink: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setLoading(true);

      // API endpoint mapping
      const endpointMap = {
        student: "http://localhost:5000/api/student/signup",
        company: "http://localhost:5000/api/company/signup",
        campus: "http://localhost:5000/api/campus/signup",
      };

      const res = await axios.post(endpointMap[formData.role], formData);

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ ...res.data.student || res.data.company || res.data.campus, role: formData.role }));

      toast.success("Account created successfully!");

      // Redirect based on role
      switch (formData.role) {
        case "student":
          navigate("/dashboard");
          break;
        case "company":
          navigate("/company/dashboard");
          break;
        case "campus":
          navigate("/campus/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select name="role" value={formData.role} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="student">Student</option>
            <option value="company">Company</option>
            <option value="campus">Campus</option>
          </select>

          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="text" name="department" placeholder={formData.role === "student" ? "Department" : "Company Name"} value={formData.department} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {formData.role === "student" && (
            <input type="text" name="resumeLink" placeholder="Resume Link" value={formData.resumeLink} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          )}
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition-all">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer font-semibold hover:underline" onClick={() => navigate("/login")}>
            Go to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
