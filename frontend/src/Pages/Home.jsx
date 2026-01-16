import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-center px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
        Ready to Launch Your Career?
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
        Don’t miss out on exclusive opportunities. Join hundreds of ambitious students 
        already utilizing our portal to secure real-world internships and advance their professional futures.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Create Account
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md"
        >
          Login to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;
