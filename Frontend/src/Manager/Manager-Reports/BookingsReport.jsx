import React, { useEffect, useState } from 'react';
import axios from "axios";

const BookingsReport = () => {

  const [reportData, setReportData] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    checkedInBookings: 0,
    checkedOutBookings: 0,
    cancelledBookings: 0
  });

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH BOOKINGS REPORT
  // ======================================================

  const fetchBookingsReport = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/reports/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      console.log(
        "BOOKINGS REPORT:",
        response.data
      );

      setReportData(
        response.data.report
      );

    } catch (error) {

      console.log(
        "REPORT ERROR:",
        error.response?.data || error.message
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchBookingsReport();

  }, []);

  // ======================================================
  // CARDS DATA
  // ======================================================

  const corePerformanceStats = [

    {
      title: "Total Bookings",
      value: loading
        ? "..."
        : reportData.totalBookings,
      iconStyles:
        "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      )
    },

    {
      title: "Pending Bookings",
      value: loading
        ? "..."
        : reportData.pendingBookings,
      iconStyles:
        "text-cyan-600 bg-cyan-50 border-cyan-100",
      icon: (
        <svg
          className="w-5 h-5"
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
      title: "Confirmed Bookings",
      value: loading
        ? "..."
        : reportData.confirmedBookings,
      iconStyles:
        "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: (
        <svg
          className="w-5 h-5"
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
      )
    },

    {
      title: "Checked-in Bookings",
      value: loading
        ? "..."
        : reportData.checkedInBookings,
      iconStyles:
        "text-indigo-600 bg-indigo-50 border-indigo-100",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
          />
        </svg>
      )
    },

    {
      title: "Checked-out Bookings",
      value: loading
        ? "..."
        : reportData.checkedOutBookings,
      iconStyles:
        "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7"
          />
        </svg>
      )
    },

    {
      title: "Cancelled Bookings",
      value: loading
        ? "..."
        : reportData.cancelledBookings,
      iconStyles:
        "text-rose-600 bg-rose-50 border-rose-100",
      icon: (
        <svg
          className="w-5 h-5"
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
      )
    }

  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">

        <div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Bookings{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
              Overview
            </span>
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Real-time performance metrics and operations analytics summary.
          </p>

        </div>

      </div>

      {/* CARDS */}
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

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ${card.iconStyles}`}
              >
                {card.icon}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default BookingsReport;