import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackReport = () => {

  const [report, setReport] = useState({
    totalFeedbacks: 0,
    averageRating: 0
  });

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH FEEDBACK REPORT
  // ======================================================

  const fetchFeedbackReport = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reports/feedbacks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "FEEDBACK REPORT:",
        response.data
      );

      setReport(response.data.report);

    } catch (error) {

      console.log(
        "FEEDBACK REPORT ERROR:",
        error.response?.data || error.message
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchFeedbackReport();

  }, []);

  // ======================================================
  // CARDS DATA
  // ======================================================

  const stats = [
    {
      title: "Total Feedbacks",
      value: loading
        ? "..."
        : `${report.totalFeedbacks} Reviews`,
      subtitle: "All reviews collected from guests",
      iconStyles:
        "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),

      extraContent: (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-indigo-50 text-[rgb(94,74,247)] font-bold px-2 py-0.5 rounded-md border border-indigo-100">
            Live
          </span>

          <span className="text-xs text-slate-400 font-medium">
            Real-time feedback tracking
          </span>
        </div>
      )
    },

    {
      title: "Average Rating",

      value: loading
        ? "..."
        : `${report.averageRating} / 5.0`,

      subtitle:
        "Overall customer satisfaction score",

      iconStyles:
        "text-amber-500 bg-amber-50 border-amber-100",

      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),

      extraContent: (
        <div className="flex items-center gap-1 mt-2">

          {[1, 2, 3, 4, 5].map((star) => (

            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(report.averageRating)
                  ? "text-amber-400"
                  : "text-slate-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

          ))}

          <span className="text-xs text-slate-400 font-semibold ml-2">
            Guest Experience Score
          </span>

        </div>
      )
    }
  ];

  return (

    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

      {/* 👑 HEADER */}

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">

        <div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">

            Feedback{" "}

            <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
              Analytics
            </span>

          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review counts and guest satisfaction metrics overview.
          </p>

        </div>

      </div>

      {/* 🚀 CARDS */}

      <div className="max-w-4xl mx-auto space-y-6">

        {stats.map((card, i) => (

          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] border border-slate-100 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
          >

            <div className="space-y-1.5 flex-1">

              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-500 transition-colors">
                {card.title}
              </span>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </h3>

              <p className="text-xs text-slate-400 font-medium">
                {card.subtitle}
              </p>

              {card.extraContent}

            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-sm ml-4 shrink-0 ${card.iconStyles}`}
            >
              {card.icon}
            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default FeedbackReport;