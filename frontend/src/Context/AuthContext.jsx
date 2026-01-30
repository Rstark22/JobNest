import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("studentToken");
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    //No student logged in
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Fetch profile error:", error.response?.data || error);
        toast.error("Failed to load student profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const updateProfile = async (updatedProfile) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/student/profile`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error.response?.data || error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        loading,
        isAuthenticated: !!profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
