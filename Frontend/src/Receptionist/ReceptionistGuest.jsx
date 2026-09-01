import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Guests = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH API =================
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await API.get('/guest/all');

        console.log("Guests API:", res.data);

        setUsers(res.data?.guests || []);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
          "Failed to load guests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // ================= LOADING =================
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

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        No guests found
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white">
      
      {/* 👑 Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Guest <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Users</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage user profiles, secure contact numbers, addresses, and stay preferences.
          </p>
        </div>
      </div>

      {/* 🚀 Cards */}
      <div className="max-w-5xl mx-auto space-y-5">
        {users.map((user) => (
          <div 
            key={user._id}
            className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
          >

            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center font-black text-slate-700 text-lg group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-colors">
                  {user.name?.charAt(0) || "U"}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {user.name || "No Name"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">

                    {/* Email */}
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                      {user.email}
                    </span>

                    <span className="hidden sm:inline text-slate-300">•</span>

                    {/* Contact */}
                    <span className="flex items-center gap-1 font-bold text-[rgb(94,74,247)]">
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.contactNumber || 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm">

              {/* Address */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Address
                </span>

                <div className="flex items-start gap-1.5 text-slate-600 font-medium">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>

                  <span>{user.address || "Not Available"}</span>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Stay Preferences
                </span>

                <div className="flex flex-wrap gap-1.5 pt-0.5">

                  {(user.preferences || []).length > 0 ? (
                    user.preferences.map((pref, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-slate-50 text-slate-700 font-semibold border border-slate-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all group-hover:border-slate-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(58,163,2)]"></span>
                        {pref}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No preferences</span>
                  )}

                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Guests;