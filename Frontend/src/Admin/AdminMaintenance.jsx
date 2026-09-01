import React, { useState, useEffect } from 'react';
import API from "../api/axios";

const AdminMaintenance = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSaving, setIsSaving] = useState(false);

  // ==============================
  // REAL API DATA STATE
  // ==============================
  const [tickets, setTickets] = useState([]);

  // ==============================
  // FETCH MAINTENANCE FROM API
  // ==============================
  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/maintenance/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.requests || [];

      // ==============================
      // MAP BACKEND → FRONTEND FORMAT
      // ==============================
      const formatted = data.map((item) => ({
        id: item._id,
        roomNumber: item.room?.roomNumber || "N/A",
        reporterType: item.reportedByGuest
          ? "Guest"
          : item.reportedByStaff
            ? "Staff"
            : "Unknown",
        issue: item.issue,
        status: item.status
      }));

      setTickets(formatted);

    } catch (error) {
      console.log(error);
    }
  };

  // ==============================
  // STATUS UPDATE (LOCAL ONLY FOR NOW)
  // ==============================
  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const token = localStorage.getItem("token");

      // optimistic UI update
      setTickets((prev) =>
        prev.map((tkt) =>
          tkt.id === id ? { ...tkt, status: nextStatus } : tkt
        )
      );

      // CALL API BASED ON STATUS
      if (nextStatus === "in_progress") {
        await API.patch(
          `/maintenance/in-progress/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (nextStatus === "resolved") {
        await API.patch(
          `/maintenance/resolve/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  const filteredTickets =
    filterStatus === 'all'
      ? tickets
      : tickets.filter(t => t.status === filterStatus);


  // Helper
  const normalizeStatus = (status) => {
    if (status === "in-progress") return "in_progress";
    return status;
  };

  const displayStatus = (status) => {
    if (status === "in_progress") return "in-progress";
    return status;
  };
return (
  <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 font-sans text-slate-800 antialiased">

    {/* HEADER */}
    <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
          Maintenance & <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Issue Tracker</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track operational tickets and update real-time facility infrastructure lifecycle statuses.
        </p>
      </div>
    </div>

    {/* FILTERS */}
    <div className="max-w-4xl mx-auto space-y-4">

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize whitespace-nowrap cursor-pointer ${
              filterStatus === status
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-xs font-bold">
            No maintenance requests found.
          </div>
        ) : (
          filteredTickets.map((tkt) => {
            const isResolved = tkt.status === "resolved";
            const isInProgress = tkt.status === "in_progress";

            return (
              <div
                key={tkt.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.04)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >

                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">

                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-black rounded-md uppercase">
                      Room {tkt.roomNumber}
                    </span>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                      tkt.reporterType === "Guest"
                        ? "bg-purple-50 border-purple-100 text-purple-700"
                        : "bg-blue-50 border-blue-100 text-blue-700"
                    }`}>
                      {tkt.reporterType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tkt.issue}
                  </p>
                </div>

                {/* STATUS */}
                <div className="sm:text-right shrink-0 flex flex-col sm:items-end gap-2">

                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                    tkt.status === "resolved"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : tkt.status === "in_progress"
                      ? "bg-amber-50 border-amber-100 text-amber-700"
                      : "bg-rose-50 border-rose-100 text-rose-700"
                  }`}>
                    {tkt.status}
                  </span>

                  <select
                    value={tkt.status}
                    onChange={(e) => handleUpdateStatus(tkt.id, e.target.value)}
                    disabled={isResolved}
                    className={`text-[11px] font-bold bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600 ${
                      isResolved ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="pending" disabled={isInProgress || isResolved}>
                      Pending
                    </option>

                    <option value="in_progress" disabled={isResolved}>
                      In Progress
                    </option>

                    <option value="resolved">
                      Resolved
                    </option>
                  </select>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
);}

export default AdminMaintenance;