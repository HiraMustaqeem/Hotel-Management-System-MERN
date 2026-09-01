import React, { useState } from 'react';
import API from "../api/axios"; 

const RoomsAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    checkinDate: '',
    checkoutDate: '',
  });
  const today = new Date().toISOString().split("T")[0];

  // Query Result State (Shuru mein null hoga yaani khali field)
  const [resultData, setResultData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleCheckAvailability = async (e) => {

  e.preventDefault();

  setHasSearched(true);
  setLoading(true);

  try {

    const token = localStorage.getItem("token");

    const response = await API.post(
      "/booking/check-availability",
      {
        roomId: formData.roomNumber,
        checkInDate: formData.checkinDate,
        checkOutDate: formData.checkoutDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = response.data;

    let icon = "";

let colorClass = "";
let status = "";

if (data.available) {

  colorClass =
    "bg-emerald-50 text-emerald-800 border-emerald-200";

  status = "success";

} else {

  colorClass =
    "bg-rose-50 text-rose-800 border-rose-200";

  status = "error";
}

setResultData({
  heading: data.available
    ? "Room Available"
    : "Room Not Available",

  message: data.msg,

  colorClass,
  status
});

  } catch (error) {

  console.log("FRONTEND ERROR:", error.response?.data);

 setResultData({
  heading: "Error",

  message:
    error.response?.data?.msg ||
    error.message ||
    "Something went wrong",

  colorClass:
    "bg-amber-50 text-amber-800 border-amber-200",

  status: "warning"
});

} finally {

    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* 📋 Header Section */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rooms Availability Registry</h1>
        <p className="text-sm text-slate-500 mt-1">Live database lookup for checking room availability status instantly.</p>
      </div>

      {/* 📝 Input Form Box */}
      <div 
        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm transition-all"
        style={{ border: '1px solid rgb(94, 74, 247)' }}
      >
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">Availability Parameter Setup</h3>

        <form onSubmit={handleCheckAvailability} className="space-y-5">
          
          {/* 🔢 Room Number (Now spans single full line since status is removed) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Room Number</label>
            <input 
              type="text" 
              required 
              name="roomNumber" 
              value={formData.roomNumber} 
              onChange={handleInputChange} 
              placeholder="e.g., 101, 102, 103, 204" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94, 74, 247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 📅 Check-In Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Check-In Date</label>
             <input 
  type="date"
  required
  min={today}
  name="checkinDate"
  value={formData.checkinDate}
  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94, 74, 247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700" 

/>
            </div>

            {/* 📅 Check-Out Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Check-Out Date</label>
             <input 
  type="date"
  required
  min={formData.checkinDate || today}
  name="checkoutDate"
  value={formData.checkoutDate}
  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94, 74, 247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700" 

/>
            </div>
          </div>

          {/* 🔍 Check Availability Button */}
          <button 
            type="submit" 
            className="w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-[0.99] transition-all text-sm mt-4 hover:opacity-95 flex items-center justify-center gap-2" 
            style={{ backgroundColor: 'rgb(94, 74, 247)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Check Availability Status
          </button>

        </form>
      </div>

      {/* 📊 DYNAMIC LIVE AVAILABILITY RESULT BLOCK (Khali field placeholder jo result dikhayegi) */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
        style={{ border: '1px solid rgb(94, 74, 247)' }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Live System Query Result</h4>
          <span className="text-xs font-semibold text-slate-400">Live Diagnostics Panel</span>
        </div>

{!hasSearched ? (

  <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 font-medium text-xs">
    Enter parameters above and click button to fetch live structural allocation data.
  </div>

) : loading ? (

  <div className="flex items-center justify-center py-10">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-[rgb(94,74,247)] rounded-full animate-spin"></div>
  </div>

) : (

 <div className={`p-4 border rounded-xl flex items-start gap-3 ${resultData.colorClass} animate-fade-in`}>

  {/* SVG ICONS */}
  <div className="mt-0.5 shrink-0">

    {resultData.status === "success" && (
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    )}

    {resultData.status === "error" && (
      <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    )}

    {resultData.status === "warning" && (
      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    )}

  </div>

  <div>
    <h5 className="font-extrabold text-sm tracking-tight">
      {resultData.heading}
    </h5>

    <p className="text-xs mt-1 font-medium opacity-90 leading-relaxed">
      {resultData.message}
    </p>
  </div>

</div>

)}
      </div>

    </div>
  );
};

export default RoomsAvailability;