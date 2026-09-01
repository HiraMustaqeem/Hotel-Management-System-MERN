import React, { useState } from "react";
import API from "../../api/axios"; 

const AddStaff = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/admin/create-staff", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      alert(response.data.msg || "Staff created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "receptionist"
      });

    } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE DATA:", error?.response?.data);
  console.log("STATUS:", error?.response?.status);

  alert(error?.response?.data?.msg || "Failed to create staff");
}
  };
  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white flex items-center justify-center">
      
      {/* 📦 Main Card Workspace */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_-4px_rgba(148,163,184,0.1)] overflow-hidden">
        
        {/* Form Title Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
              Register New <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Staff Member</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Create official credential accounts and assign operational facility roles to internal employees.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-xl text-[11px] font-bold text-indigo-600 self-start sm:self-center">
            Secure Panel
          </div>
        </div>

        {/* 📋 Form Entry Interface */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

          {/* Section 2: Text Inputs 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Input Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 tracking-wide uppercase block">Full Name</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Muhammad Ali"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white placeholder-slate-300 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all"
              />
            </div>

        

            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 tracking-wide uppercase block">Email Address</label>
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ali.reception@hotel.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white placeholder-slate-300 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 tracking-wide uppercase block">Account Password</label>
              <input 
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white placeholder-slate-300 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all"
              />
            </div>

            {/* Dropdown Role Menu Select */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 tracking-wide uppercase block">System Privilege Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white text-slate-700 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="manager">Manager</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">House Keeping</option>
                </select>
                {/* Custom styling clean arrow layout wrapper */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          
          </div>

          {/* Action Footer Button Group */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => {
                setFormData({ name: '', email: '', password: '', role: 'receptionist'
                  // ,   profileImage: null 
                });
                // setImagePreview(null);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              Clear Entries
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[rgb(94,74,247)] hover:bg-indigo-600 shadow-md shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Save Staff Member
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddStaff;