import React, { useEffect, useState } from "react";
import axios from "axios";

const MaintenanceReport = () => {

  const [report, setReport] = useState({
    totalMaintenanceRequests: 0,
    inProcessMaintenanceRequests: 0,
    resolvedMaintenanceRequests: 0
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH MAINTENANCE REPORT
  // ==============================

  const fetchMaintenanceReport = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reports/maintenance",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("MAINTENANCE REPORT:", response.data);

      setReport(response.data.report);

    } catch (error) {

      console.log(
        "MAINTENANCE ERROR:",
        error.response?.data || error.message
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceReport();
  }, []);

  // ==============================
  // CARDS
  // ==============================

  const stats = [
    {
      title: "Total Maintenance Requests",
      value: loading ? "..." : report.totalMaintenanceRequests,
      subtitle: "All maintenance issues logged",
      iconStyles: "text-amber-600 bg-amber-50 border-amber-100",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },

    {
      title: "In-Process Requests",
      value: loading ? "..." : report.inProcessMaintenanceRequests,
      subtitle: "Currently being handled",
      iconStyles: "text-[rgb(94,74,247)] bg-indigo-50 border-indigo-100",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      )
    },

    {
      title: "Resolved Requests",
      value: loading ? "..." : report.resolvedMaintenanceRequests,
      subtitle: "Successfully completed fixes",
      iconStyles: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 pb-6 border-b border-slate-200/60">
        <h1 className="text-3xl font-black text-slate-900">
          Maintenance <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Report</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Live tracking of maintenance operations
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-5xl mx-auto space-y-5">

        {stats.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-500">
                {card.title}
              </span>

              <h3 className="text-3xl font-black text-slate-900">
                {card.value}
              </h3>

              <p className="text-xs text-slate-400 font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ml-4 shrink-0 ${card.iconStyles}`}>
              {card.icon}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default MaintenanceReport;