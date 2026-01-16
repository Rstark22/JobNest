import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

const Skills = () => {
  const { profile, updateProfile } = useContext(AuthContext);
  const [skills, setSkills] = useState(profile?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile?.skills) setSkills(profile.skills);
  }, [profile]);

  const addSkill = async () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      await updateProfile({ ...profile, skills: updated }); // Save immediately to backend
      setNewSkill("");
    }
  };

  const removeSkill = async (skill) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    await updateProfile({ ...profile, skills: updated }); // Save immediately
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add skill"
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={addSkill}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {skills.map((skill, idx) => (
          <div key={idx} className="bg-blue-200 px-3 py-1 rounded flex items-center gap-1">
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-red-500">x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
