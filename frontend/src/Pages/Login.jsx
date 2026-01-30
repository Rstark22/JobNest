import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginFixed() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", role: "student" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password || !form.role) {
            toast.error("Please enter all fields");
            return;
        }

        try {
            setLoading(true);

            // API endpoint mapping based on role
            const endpointMap = {
                student: "http://localhost:5000/api/student/login",
                company: "http://localhost:5000/api/company/login",
                campus: "http://localhost:5000/api/campus/login",
            };

            const res = await axios.post(endpointMap[form.role], {
                email: form.email,
                password: form.password,
            });

            // Save token and user info depending on role
            let userData;
            if (form.role === "student") userData = res.data.student;
            if (form.role === "company") userData = res.data; // FIXED: Company returns flat object
            if (form.role === "campus") userData = res.data.campus;

            localStorage.setItem("token", res.data.token);
            // Also save specific token keys as expected by different Dashboards
            if (form.role === "student") localStorage.setItem("studentToken", res.data.token);
            if (form.role === "campus") localStorage.setItem("campusToken", res.data.token);
            if (form.role === "company") localStorage.setItem("companyToken", res.data.token);

            localStorage.setItem("user", JSON.stringify({ ...userData, role: form.role }));

            toast.success("Login successful!");

            // Redirect based on role
            switch (form.role) {
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
            console.error(err);
            toast.error(err.response?.data?.message || "Server error, try again later");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-200 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Login
                </h2>

                <p className="text-center text-gray-600 mb-6">
                    Select your role and enter your credentials to access your dashboard.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Role Selector */}
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        <option value="student">Student</option>
                        <option value="company">Company</option>
                        <option value="campus">Campus</option>
                    </select>

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        required
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Signup link */}
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 cursor-pointer font-semibold hover:underline"
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}
