import React, { useEffect, useState } from 'react';
import axios from "axios";

const StaffReport = () => {

  const [report, setReport] = useState({

    totalStaff: 0,
    activeStaff: 0,
    inActiveStaff: 0,
    totalManager: 0,
    totalReceptionist: 0,
    totalHousekeeper: 0

  });

  // ======================================================
  // FETCH STAFF REPORT
  // ======================================================

  const fetchStaffReport = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reports/staff",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "STAFF REPORT:",
        response.data
      );

      setReport(response.data.report);

    } catch (error) {

      console.log(
        "STAFF REPORT ERROR:",
        error.response?.data || error.message
      );

    }
  };

  useEffect(() => {

    fetchStaffReport();

  }, []);

  // ======================================================
  // STAFF ANALYTICS CARDS
  // ======================================================

  const stats = [

    {
      label: "Total Workforce",
      count: report.totalStaff,
      subtext: "Total registered team members",
      cardStyles:
        "bg-white border-slate-100 hover:border-slate-300 shadow-[0_4px_25px_-5px_rgba(148,163,184,0.15)]",
      iconStyles:
        "text-slate-700 bg-slate-50 border-slate-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      )
    },

    {
      label: "Active Duty",
      count: report.activeStaff,
      subtext: "Staff currently clocked-in & available",
      cardStyles:
        "bg-gradient-to-b from-white to-emerald-50/20 border-slate-100 hover:border-emerald-200 shadow-[0_4px_25px_-5px_rgba(16,185,129,0.12)]",
      iconStyles:
        "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      )
    },

    {
      label: "On Leave / In-Active",
      count: report.inActiveStaff,
      subtext: "Off-duty or temporarily unavailable",
      cardStyles:
        "bg-gradient-to-b from-white to-rose-50/20 border-slate-100 hover:border-rose-200 shadow-[0_4px_25px_-5px_rgba(244,63,94,0.12)]",
      iconStyles:
        "text-rose-600 bg-rose-50 border-rose-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      )
    },

    {
      label: "Management Core",
      count: report.totalManager,
      subtext: "Executive & operations management",
      cardStyles:
        "bg-gradient-to-b from-white to-amber-50/20 border-slate-100 hover:border-amber-200 shadow-[0_4px_25px_-5px_rgba(245,158,11,0.12)]",
      iconStyles:
        "text-amber-600 bg-amber-50 border-amber-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      )
    },

    {
      label: "Front Desk / Reception",
      count: report.totalReceptionist,
      subtext:
        "Guest relations & front office operations",
      cardStyles:
        "bg-gradient-to-b from-white to-indigo-50/20 border-slate-100 hover:border-indigo-200 shadow-[0_4px_25px_-5px_rgba(94,74,247,0.12)]",
      iconStyles:
        "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      )
    },

    {
      label: "Housekeeping Team",
      count: report.totalHousekeeper,
      subtext:
        "Sanitization & facility cleanliness maintenance",
      cardStyles:
        "bg-gradient-to-b from-white to-sky-50/20 border-slate-100 hover:border-sky-200 shadow-[0_4px_25px_-5px_rgba(14,165,233,0.12)]",
      iconStyles:
        "text-sky-600 bg-sky-50 border-sky-100",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      )
    }

  ];

  return (

    <div className="bg-[#f8fafc] min-h-screen p-8 font-sans antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

      {/* 👑 VIP Header Section */}
      <div className="relative mb-10 pb-6 border-b border-slate-200/60">

        <div className="mb-2">
          <span className="text-[10px] bg-indigo-50 text-[rgb(94,74,247)] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-indigo-100">
            Operations Console
          </span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Real-Time{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
            Staff Analytics
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 max-w-4xl mt-2 leading-relaxed">
          Monitor shift distribution, workforce availability, and specialized department deployment.
        </p>

      </div>

      {/* 🚀 GRID */}
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.slice(0, 2).map((stat, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-2xl border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${stat.cardStyles}`}
            >

              <div className="flex items-start justify-between gap-6">

                <div className="space-y-2">

                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                    {stat.label}
                  </p>

                  <h3 className="text-5xl font-black text-slate-900 tracking-tight">
                    {stat.count}
                  </h3>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ${stat.iconStyles}`}>
                  {stat.icon}
                </div>

              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-400 font-medium">
                {stat.subtext}
              </div>

            </div>
          ))}
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.slice(2, 4).map((stat, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-2xl border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${stat.cardStyles}`}
            >

              <div className="flex items-start justify-between gap-6">

                <div className="space-y-2">

                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                    {stat.label}
                  </p>

                  <h3 className="text-5xl font-black text-slate-900 tracking-tight">
                    {stat.count}
                  </h3>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ${stat.iconStyles}`}>
                  {stat.icon}
                </div>

              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-400 font-medium">
                {stat.subtext}
              </div>

            </div>
          ))}
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.slice(4, 6).map((stat, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-2xl border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${stat.cardStyles}`}
            >

              <div className="flex items-start justify-between gap-6">

                <div className="space-y-2">

                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                    {stat.label}
                  </p>

                  <h3 className="text-5xl font-black text-slate-900 tracking-tight">
                    {stat.count}
                  </h3>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ${stat.iconStyles}`}>
                  {stat.icon}
                </div>

              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-400 font-medium">
                {stat.subtext}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default StaffReport;