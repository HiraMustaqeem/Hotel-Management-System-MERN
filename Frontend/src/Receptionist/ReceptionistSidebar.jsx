import React, { useState, useEffect } from 'react';
import API from "../api/axios";
const ReceptionistSidebar = ({ setActivePage, activePage }) => {
  const [openDropdown, setOpenDropdown] = useState('');
  const [staffName, setStaffName] = useState("Receptionist");

  const Icon = ({ d }) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
    </svg>
  );
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  const isDropdownActive = (dropdownName) => {
    if (dropdownName === 'bookings-group') {
      return ['all-bookings', 'pending-bookings'].includes(activePage);
    }
    return false;
  };

  const getButtonClass = (pageName, isDropdown = false) => {
    const baseClass = "w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98]";
    const isActive = isDropdown ? isDropdownActive(pageName) : activePage === pageName;

    if (isActive) {
      return `${baseClass} text-white shadow-md shadow-[rgba(94,74,247,0.25)]`;
    }
    return `${baseClass} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
  };

  const getSubButtonClass = (pageName) => {
    const baseClass = "flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs transition-colors duration-150";
    if (activePage === pageName) {
      return `${baseClass} font-semibold text-[rgb(94,74,247)] bg-[rgb(94,74,247)]/10 border-l-2 border-[rgb(94,74,247)] rounded-l-none`;
    }
    return `${baseClass} text-slate-600 hover:text-slate-900 hover:bg-slate-100`;
  };

  const activeStyle = (pageName, isDropdown = false) => {
    const isActive = isDropdown ? isDropdownActive(pageName) : activePage === pageName;
    return isActive ? { backgroundColor: 'rgb(94, 74, 247)' } : {};
  };

  useEffect(() => {
    fetchStaffName();
  }, []);


  const fetchStaffName = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/staff/my-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const name = res.data.staff?.name;

      setStaffName(name || "Receptionist");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-66 bg-white text-slate-700 h-screen sticky top-0 flex flex-col font-sans text-sm border-r border-slate-200 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.04)] select-none">

      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm"
          style={{ backgroundColor: 'rgb(94, 74, 247)' }}
        >
          L
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Luxury Stay</h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Receptionist Portal</p>
        </div>
      </div>

      {/* Staff Welcome Card */}
      <div className="mx-4 mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <p className="text-[11px] text-slate-400 font-medium">Welcome Receptionist</p>
        <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{staffName}*</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto chunk-scrollbar">

        {/* 1. Dashboard */}
        <button
          onClick={() => setActivePage?.('dashboard')}
          className={getButtonClass('dashboard')}
          style={activeStyle('dashboard')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </div>
        </button>


        {/*  Reports Dropdown Group */}
        <div>
          <button
            onClick={() => toggleDropdown('reports-group')}
            className={getButtonClass('reports-group', true)}
            style={activeStyle('reports-group', true)}
          >
            <div className="flex items-center gap-3">
              {/* Chart/Report Icon */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Reports</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'reports-group' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'reports-group' || isDropdownActive('reports-group') ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">

              {/* 1. Bookings Report Sub-button */}
              <button onClick={() => setActivePage?.('report-bookings')} className={getSubButtonClass('report-bookings')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Bookings</span>
              </button>

              {/* 2. Rooms Report Sub-button */}
              <button
                onClick={() => setActivePage?.('report-rooms')}
                className={getSubButtonClass('report-rooms')}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                </svg>
                <span>Rooms</span>
              </button>
            </div>
          </div>
        </div>



        {/* 4. Bookings Dropdown Group */}
        <div>
          <button
            onClick={() => toggleDropdown('bookings-group')}
            className={getButtonClass('bookings-group', true)}
            style={activeStyle('bookings-group', true)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bookings</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'bookings-group' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'bookings-group' || isDropdownActive('bookings-group') ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">

              {/* 1. All Bookings Sub-button */}
              <button onClick={() => setActivePage?.('bookings-all')} className={getSubButtonClass('bookings-all')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>All Bookings</span>
              </button>

              {/* 2. Add Bookings Sub-button */}
              <button onClick={() => setActivePage?.('bookings-add')} className={getSubButtonClass('bookings-add')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Booking</span>
              </button>

            </div>
          </div>
        </div>


        {/*  Rooms Button */}
        <button
          onClick={() => setActivePage?.('rooms')}
          className={getButtonClass('rooms')}
          style={activeStyle('rooms')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Rooms</span>
          </div>
        </button>



        {/* Rooms Availability Button */}
        <button
          onClick={() => setActivePage?.('rooms-availability')}
          className={getButtonClass('rooms-availability')}
          style={activeStyle('rooms-availability')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Rooms Availability</span>
          </div>
        </button>

        {/* 2. Guests */}

        <button
          onClick={() => setActivePage?.('total-guests')}
          className={getButtonClass('total-guests')}
          style={activeStyle('total-guests')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Guests</span>
          </div>
        </button>




        {/*  Invoices Button */}
        <button
          onClick={() => setActivePage?.('invoices')}
          className={getButtonClass('invoices')}
          style={activeStyle('invoices')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Invoices</span>
          </div>
        </button>


        {/* Receptionist Services */}
        <button
          onClick={() => setActivePage?.('ReceptionistServices')}
          className={getButtonClass('ReceptionistServices')}
          style={activeStyle('ReceptionistServices')}
        >
          <div className="flex items-center gap-3">
            <Icon d="M4 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM13 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V6zM4 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3zM13 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" />
            <span>Services</span>
          </div>
        </button>

                {/* Maintenance Report */}
        <button
          onClick={() => setActivePage?.('MaintenanceReport')}
          className={getButtonClass('MaintenanceReport')}
          style={activeStyle('MaintenanceReport')}
        >
          <div className="flex items-center gap-3">
            <Icon d="M4 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM13 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V6zM4 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3zM13 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" />
            <span>Report Maintenance </span>
          </div>
        </button>


        {/* Profile Button Option */}
        <button
          onClick={() => setActivePage?.('profile')}
          className={getButtonClass('profile')}
          style={activeStyle('profile')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile Settings</span>
          </div>
        </button>



        {/* Password Settings Button */}
        <button
          onClick={() => setActivePage?.('change-password')}
          className={getButtonClass('change-password')}
          style={activeStyle('change-password')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Receptionist Password</span>
          </div>
        </button>
        <div className="border-t border-slate-100 my-4"></div>

        {/* Logout */}
        <button
          onClick={() => setActivePage?.('logout')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default ReceptionistSidebar;