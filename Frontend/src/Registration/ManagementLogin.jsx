import React, { useState, useEffect } from 'react';import axios from "axios";
import { useNavigate } from "react-router-dom";
const ManagementLogin = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  email: '',
  password: '',
  role: 'receptionist'
});
useEffect(() => {
  window.history.pushState(null, "", window.location.href);

  const handleBack = () => {
    navigate("/managementLogin", { replace: true });
  };

  window.addEventListener("popstate", handleBack);

  return () => window.removeEventListener("popstate", handleBack);
}, [navigate]);
  const [error, setError] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submit
 const handleSubmit = async (e) => {

  e.preventDefault();

  setError('');

  // Validation
  if (!formData.email || !formData.password) {

    setError('Please fill in all mandatory fields.');

    return;
  }

  try {

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: formData.email,
        password: formData.password
      }
    );

    console.log("LOGIN RESPONSE:", response.data);

    // =========================
    // SAVE TOKEN + ROLE
    // =========================

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "role",
      response.data.role
    );

    const userRole =
      response.data.role.toLowerCase();

    // =========================
    // ROLE BASED REDIRECT
    // =========================

    if (userRole === "admin") {

      navigate("/admin");

    }

    else if (userRole === "manager") {

      navigate("/manager");

    }

    else if (userRole === "receptionist") {

      navigate("/receptionist");

    }

    else if (
      userRole === "housekeeping" 
      // userRole === "staff"
    ) {

      navigate("/housekeeping");

    }

    else {

      navigate("/");

    }

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.msg ||
      "Login failed"
    );
  }
};

  return (
    <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_10px_30px_-5px_rgba(148,163,184,0.1)]">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Management <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Portal Login</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Enter your system credentials to access your dashboard
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Email Field */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@hotel.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 shadow-xs focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* 2. Password Field */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 shadow-xs focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* 3. Role Dropdown Field */}
          {/* <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Select Workspace Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 shadow-xs focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all appearance-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="housekeeping">HouseKeeper</option>
              </select>
              {/* Dropdown Custom Arrow Icon 
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div> */}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[rgb(94,74,247)] hover:bg-indigo-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Authorize & Sign In
          </button>

        </form>

      </div>
    </div>
  );
};

export default ManagementLogin;