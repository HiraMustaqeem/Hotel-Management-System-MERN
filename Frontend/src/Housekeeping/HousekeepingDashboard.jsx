import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Home,
  Sparkles,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const HousekeepingDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Rooms", count: 0, color: "text-blue-600", icon: Home },
    { title: "Cleaning Required", count: 0, color: "text-orange-500", icon: Sparkles },
    { title: "Available Rooms", count: 0, color: "text-emerald-600", icon: CheckCircle2 }
  ]);

  const [cleaningTasks, setCleaningTasks] = useState([]);

  useEffect(() => {
    fetchRoomsReport();
    fetchCleaningTasks();
  }, []);

  const fetchRoomsReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/reports/rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const report = res.data.report;

      setStats([
        { title: "Total Rooms", count: report.totalRooms, color: "text-blue-600", icon: Home },
        { title: "Cleaning Required", count: report.cleaningRooms, color: "text-orange-500", icon: Sparkles },
        { title: "Available Rooms", count: report.availableRooms, color: "text-emerald-600", icon: CheckCircle2 }
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCleaningTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/housekeeping/cleaning-tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCleaningTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAvailable = async (roomId) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/housekeeping/update-status/${roomId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCleaningTasks();
      fetchRoomsReport();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-10">

      {/* HEADER (PREMIUM HERO STYLE) */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-slate-100 rounded-2xl p-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Housekeeping Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Real-time room operations, cleaning workflow & maintenance tracking.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    {stat.title}
                  </p>

                  <h2 className={`text-3xl font-black mt-2 ${stat.color}`}>
                    {stat.count}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-110 transition">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            Urgent Cleaning Tasks
          </h2>

          <button
            onClick={fetchCleaningTasks}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left px-6 py-4">Room</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {cleaningTasks.length > 0 ? (
                cleaningTasks.map((room) => (
                  <tr
                    key={room._id}
                    className="border-t border-slate-50 hover:bg-indigo-50/30 transition"
                  >

                    <td className="px-6 py-4 font-semibold text-slate-800">
                      #{room.roomNumber}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {room.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleMarkAvailable(room._id)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md transition"
                      >
                        Mark Available
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-14 text-slate-400">
                    No cleaning tasks found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default HousekeepingDashboard;