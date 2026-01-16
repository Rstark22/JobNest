import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Signup from "./Pages/SignUp.jsx";
import Login from "./Pages/Login.jsx";
import JobListing from "./Pages/JobListing.jsx";
import Settings from "./Pages/Settings.jsx";
import Reports from "./Pages/Reports.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "./Pages/Message.jsx";
import Profile from "./Pages/Profile.jsx";
import Home from "./Pages/Home.jsx";
import StudentDashboard from "./Pages/StudentDashboard.jsx";
import CompanyDashboard from "./Pages/CompanyDashboard.jsx";
import CampusDashboard from "./Pages/CampusDashboard.jsx";

// // Protected Route Component

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/signup"]; // hide navbar on home & signup
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};


function App() {
  return (
    <AuthProvider>

    <Router>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/signup" element={<Signup />} /> {/* Add this line */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/campus/dashboard" element={<CampusDashboard />}  />
          <Route path="/profile" element={<Profile />} />
          <Route path="/joblisting" element={<JobListing />} />
          <Route path="/message" element={<Message />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
