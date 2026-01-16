import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

const Profile = () => {
  const { profile, updateProfile, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (profile) setFormData(profile); // pre-fill with login data
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData); // save changes
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      <form className="space-y-3 max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
