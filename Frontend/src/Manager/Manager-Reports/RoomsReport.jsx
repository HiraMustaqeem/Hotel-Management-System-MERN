import React, { useEffect, useState } from 'react';
import axios from "axios";

const RoomsReport = () => {

  const [loading, setLoading] = useState(true);

  const [reportData, setReportData] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    cleaningRooms: 0,
    maintenanceRooms: 0
  });

  // ======================================================
  // FETCH ROOMS REPORT
  // ======================================================

  const fetchRoomsReport = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/reports/rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      console.log(
        "ROOMS REPORT:",
        response.data
      );

      setReportData(
        response.data.report
      );

    } catch (error) {

      console.log(
        "ROOM REPORT ERROR:",
        error.response?.data || error.message
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchRoomsReport();

  }, []);

  // ======================================================
  // ROOMS STATS
  // ======================================================

  const stats = [

    {
      label: "Total Inventory",
      count: loading
        ? "..."
        : reportData.totalRooms,
      subtext:
        "Total registered rooms in the system",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"
          />
        </svg>
      )
    },

    {
      label: "Available Tonight",
      count: loading
        ? "..."
        : reportData.availableRooms,
      subtext:
        "Rooms clean and ready for instant check-in",
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    },

    {
      label: "Occupied Rooms",
      count: loading
        ? "..."
        : reportData.occupiedRooms,
      subtext:
        "Currently checked-in by active guests",
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )
    },

    {
      label: "Housekeeping",
      count: loading
        ? "..."
        : reportData.cleaningRooms,
      subtext:
        "Undergoing standard cleaning and dusting",
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
    },

    {
      label: "Out of Order",
      count: loading
        ? "..."
        : reportData.maintenanceRooms,
      subtext:
        "Temporarily blocked due to maintenance",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        </svg>
      )
    }

  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-8 font-sans antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

      {/* HEADER */}
      <div className="relative mb-10 pb-6 border-b border-slate-200/60">

        <div className="mb-2">

          <span className="text-[10px] bg-indigo-50 text-[rgb(94,74,247)] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-indigo-100">
            Live Console
          </span>

        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Real-Time{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
            Rooms Analytics
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 max-w-4xl mt-2 leading-relaxed">
          Streamline your property operations with up-to-the-minute occupancy intelligence.
        </p>

      </div>

      {/* CARDS */}
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
        <div className="grid grid-cols-1">

          {stats.slice(4, 5).map((stat, idx) => (

            <div
              key={idx}
              className={`relative p-8 rounded-2xl border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group md:max-w-2xl md:mx-auto md:w-full ${stat.cardStyles}`}
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

export default RoomsReport;