import React, { useState, useEffect } from 'react';
import API from "../api/axios";

const  MaintenanceReport = () => {
  const [formData, setFormData] = useState({
  roomId: '',
  issue: ''
});

const [rooms, setRooms] = useState([]);
const [isSubmitted, setIsSubmitted] = useState(false);


useEffect(() => {
  fetchRooms();
}, []);

const fetchRooms = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const [availableRes, cleaningRes] =
      await Promise.all([

        API.get("/room/available", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),

        API.get("/room/cleaning", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      ]);

    const availableRooms =
      availableRes.data.rooms || [];

    const cleaningRooms =
      cleaningRes.data.rooms || [];

    setRooms([
      ...availableRooms,
      ...cleaningRooms
    ]);

  } catch (error) {

    console.log(error);

  }
};


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const token =
      localStorage.getItem("token");

    await API.post(
      "/maintenance/report",
      {
        roomId: formData.roomId,
        issue: formData.issue
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setIsSubmitted(true);

    setTimeout(() => {

      setIsSubmitted(false);

     setFormData({
  roomId: '',
  issue: ''
});  

    }, 2500);

  } catch (error) {

    console.log(error);

    alert(
      error?.response?.data?.msg ||
      "Failed to report maintenance issue"
    );
  }
};
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* 📋 Header Section */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report Maintenance Issue</h1>
        <p className="text-sm text-slate-500 mt-1">Dispatch rapid service facility requests for broken room items, structural faults, or plumbing issues.</p>
      </div>

      {/* 🛠️ Premium Input Form Container */}
      <div 
        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm transition-all"
        style={{ border: '1px solid rgb(94, 74, 247)' }} // ✅ Standard team core theme border applied
      >
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">Issue Diagnostics Log</h3>

        {isSubmitted ? (
          /* Success Toast Frame */
          <div className="p-8 text-center space-y-3 bg-rose-50/50 border border-rose-100 rounded-2xl animate-pulse">
            <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm text-xl">
              🛠️
            </div>
            <h4 className="text-base font-bold text-rose-950">Maintenance Ticket Logged!</h4>
            <p className="text-xs text-rose-600 font-medium">Issue broadcasted instantly to the operations and housekeeping desk squad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 🔢 Room Number Input */}
          <div className="space-y-1.5">

  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
    Room Number
  </label>

  <select
    required
    name="roomId"
    value={formData.roomId}
    onChange={handleInputChange}
    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700"
  >

    <option value="">
      Select Room
    </option>

    {rooms.map((room) => (

<option
  key={room._id}
  value={room._id}
>
  Room {room.roomNumber} ({room.roomType})
  - {room.status === "cleaning"
      ? "Cleaning"
      : "Available"}
</option>

    ))}

  </select>

</div>
            {/* 📝 Detailed Issue Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Describe the Issue</label>
              <textarea 
                required 
                rows="5"
                name="issue" 
                value={formData.issue} 
                onChange={handleInputChange} 
                placeholder="Specify broken nodes (e.g., AC not cooling, bathroom leakage, smart lock battery replacement needed...)" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700 resize-none leading-relaxed" 
              />
            </div>

            {/* 🚀 Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-[0.99] transition-all text-sm mt-4 hover:opacity-95 flex items-center justify-center gap-2" 
              style={{ backgroundColor: 'rgb(94, 74, 247)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              File Maintenance Ticket
            </button>

          </form>
        )}
      </div>

    </div>
  );
};

export default MaintenanceReport;