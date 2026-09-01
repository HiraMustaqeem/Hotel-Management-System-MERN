import React, { useEffect, useState } from 'react';
import axios from 'axios';
const ManagerDashboard = () => {
const [dashboardData, setDashboardData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/dashboard/cards",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboardData(response.data.dashboard);

    } catch (error) {

      console.log("Dashboard Fetch Error:", error);

    } finally {

      setLoading(false);

    }
  };

  fetchDashboard();

}, []);


const corePerformanceStats = [

  {
    title: "Total Bookings",
    value: dashboardData?.totalBookings || 0,
    iconStyles: "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    )
  },

  {
    title: "Total Guests",
    value: dashboardData?.totalGuests || 0,
    iconStyles: "text-cyan-600 bg-cyan-50 border-cyan-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    )
  },

  {
    title: "Total Rooms",
    value: `${dashboardData?.totalRooms || 0} Units`,
    iconStyles: "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    )
  },

  {
    title: "Total Services",
    value: `${dashboardData?.totalServices || 0}`,
    iconStyles: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    )
  },

  {
    title: "Total Feedbacks",
    value: `${dashboardData?.totalFeedbacks || 0} Reviews`,
    iconStyles: "text-amber-600 bg-amber-50 border-amber-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    )
  },

  {
    title: "Maintenance Requests",
    value: `${dashboardData?.totalMaintenanceRequests || 0} Active`,
    iconStyles: "text-rose-600 bg-rose-50 border-rose-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    )
  },

   {
    title: "Monthly Revenue",
    value: dashboardData?.monthlyRevenue?.length
      ? `Rs. ${dashboardData.monthlyRevenue[
          dashboardData.monthlyRevenue.length - 1
        ]?.revenue || 0}`
      : "Rs. 0",
    iconStyles: "text-indigo-600 bg-indigo-50 border-indigo-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-6 0a2 2 0 002 2h2a2 2 0 002-2"
        />
      </svg>
    )
  },

    {
    title: "Occupancy Rate",
    value: `${dashboardData?.occupancyRate || 0}%`,
    iconStyles: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    )
  },

  {
    title: "Most Booked Room Type",
    value: dashboardData?.mostBookedRoomType?._id
      ? `${dashboardData?.mostBookedRoomType?._id}`
      : "N/A",
    iconStyles: "text-amber-600 bg-amber-50 border-amber-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    )
  },

  {
    title: "Top Services",
    value: dashboardData?.topServices?.length
      ? dashboardData.topServices
          .slice(0, 2)
          .map(service => service._id)
          .join("  ")
      : "N/A",
    iconStyles: "text-cyan-600 bg-cyan-50 border-cyan-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    )
  }

];

if (loading) {
  return (
  <div className="min-h-screen flex items-center justify-center bg-white">
  <div className="flex flex-col items-center gap-3">
    
    {/* Spinner */}
    <div className="w-10 h-10 border-4 border-slate-200 border-t-[rgb(94,74,247)] rounded-full animate-spin"></div>
  </div>
</div>
  );
}
  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

{/* ─── PREMIUM HEADER SECTION ─── */}
<div className="max-w-7xl mx-auto mb-10">

  <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    {/* background glow */}
    <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-100 blur-3xl rounded-full"></div>
    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-100 blur-3xl rounded-full"></div>

    <div className="relative p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      {/* LEFT TEXT */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Management Console
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          Manager{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Dashboard
          </span>
        </h1>

        <p className="text-sm text-slate-500 mt-2 max-w-xl">
          Real-time overview of hotel operations, bookings, revenue, staff performance and service analytics.
        </p>
      </div>

      {/* RIGHT KPI CARDS */}
      <div className="flex flex-wrap gap-3">

        <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Status</p>
          <p className="text-sm font-black text-emerald-600">Live</p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Occupancy</p>
          <p className="text-sm font-black text-indigo-600">
            {dashboardData?.occupancyRate || 0}%
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-violet-50 border border-violet-100 w-43">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Revenue</p>
          <p className="text-sm font-black text-violet-600">
            Rs {dashboardData?.totalRevenue || 0}
          </p>
        </div>

      </div>

    </div>
  </div>
</div>
      
      {/* 🚀 Pure 2-Column Responsive Grid Layout (Hamesha 2 Cards Ek Sath) */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {corePerformanceStats.map((card, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] border border-slate-100 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-500 transition-colors">
                  {card.title}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ${card.iconStyles}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;