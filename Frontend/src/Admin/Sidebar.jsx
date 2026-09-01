import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ setActivePage, activePage }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState('');
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setActivePage?.('dashboard');

    navigate("/managementLogin", { replace: true });
    window.location.reload();
  }
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  const isDropdownActive = (dropdownName) => {
    if (dropdownName === 'reports') {
      return ['report-bookings', 'report-rooms', 'report-staffs', 'report-feedbacks', 'report-maintenance'].includes(activePage);
    }
    if (dropdownName === 'rooms') {
      return ['add-room', 'all-rooms'].includes(activePage);
    }
    if (dropdownName === 'staff') {
      return ['add-staff', 'all-staff'].includes(activePage);
    }
    if (dropdownName === 'services') {
      return ['add-services', 'all-services'].includes(activePage);
    }
    if (dropdownName === 'bookings') {
      return ['all-bookings'].includes(activePage);
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

  return (
    /* Clean Solid White Theme with a solid border definition */
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
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Admin Dashboard</p>
        </div>
      </div>

      {/* Nav Links Container */}
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


        {/* 2. Reports Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown('reports')}
            className={getButtonClass('reports', true)}
            style={activeStyle('reports', true)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Reports</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'reports' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'reports' || isDropdownActive('reports') ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">
              <button onClick={() => setActivePage?.('report-bookings')} className={getSubButtonClass('report-bookings')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span>Bookings</span>
              </button>
              <button onClick={() => setActivePage?.('report-rooms')} className={getSubButtonClass('report-rooms')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                <span>Rooms</span>
              </button>
              <button onClick={() => setActivePage?.('report-staffs')} className={getSubButtonClass('report-staffs')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>Staffs</span>
              </button>
              <button onClick={() => setActivePage?.('report-feedbacks')} className={getSubButtonClass('report-feedbacks')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span>Feedbacks</span>
              </button>
              <button onClick={() => setActivePage?.('report-maintenance')} className={getSubButtonClass('report-maintenance')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.567-.375-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                <span>Maintenance</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Guests */}
        <button
          onClick={() => setActivePage?.('guests')}
          className={getButtonClass('guests')}
          style={activeStyle('guests')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Guests</span>
          </div>
        </button>

        {/* 5. Rooms Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown('rooms')}
            className={getButtonClass('rooms', true)}
            style={activeStyle('rooms', true)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Manage Rooms</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'rooms' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'rooms' || isDropdownActive('rooms') ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">
              <button onClick={() => setActivePage?.('add-room')} className={getSubButtonClass('add-room')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Add Room</span>
              </button>
              <button onClick={() => setActivePage?.('all-rooms')} className={getSubButtonClass('all-rooms')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                <span>All Rooms</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. Staff Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown('staff')}
            className={getButtonClass('staff', true)}
            style={activeStyle('staff', true)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <span>Manage Staff</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'staff' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'staff' || isDropdownActive('staff') ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">
              <button onClick={() => setActivePage?.('add-staff')} className={getSubButtonClass('add-staff')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Add Staff</span>
              </button>
              <button onClick={() => setActivePage?.('all-staff')} className={getSubButtonClass('all-staff')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>All Staff</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown('services')}
            className={getButtonClass('services', true)}
            style={activeStyle('services', true)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm7-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <span>Manage Services</span>
            </div>
            <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'services' || isDropdownActive('services') ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="pl-3 pr-2 py-1 space-y-0.5 border-l border-slate-100 ml-6">
              <button onClick={() => setActivePage?.('add-services')} className={getSubButtonClass('add-services')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Add Services</span>
              </button>
              <button onClick={() => setActivePage?.('all-services')} className={getSubButtonClass('all-services')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>All Services</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7. Bookings Button (Styled exactly like Feedbacks) */}
        <div>
          <button
            onClick={() => setActivePage?.('bookings')}
            className={getButtonClass('bookings')}
            style={activeStyle('bookings')}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bookings</span>
            </div>
          </button>
        </div>


        {/* 8. Feedbacks */}
        <button
          onClick={() => setActivePage?.('feedbacks')}
          className={getButtonClass('feedbacks')}
          style={activeStyle('feedbacks')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>Guest Feedbacks</span>
          </div>
        </button>



        <button
          onClick={() => setActivePage?.('contacts')}
          className={getButtonClass('contacts')}
          style={activeStyle('contacts')}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-6a4 4 0 10-8 0 4 4 0 008 0zm6 10v-2a4 4 0 00-3-3.87M6 20v-2a4 4 0 013-3.87"
              />
            </svg>
            <span>Guest Contacts</span>
          </div>
        </button>

        {/* 9. Maintenance */}
        <button
          onClick={() => setActivePage?.('maintenance')}
          className={getButtonClass('maintenance')}
          style={activeStyle('maintenance')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Maintenance Requests</span>
          </div>
        </button>

        {/* 10. Settings */}
        <button
          onClick={() => setActivePage?.('settings')}
          className={getButtonClass('settings')}
          style={activeStyle('settings')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>System Settings</span>
          </div>
        </button>

        <div className="border-t border-slate-100 my-4"></div>

        {/* 11. Profile */}
        <button
          onClick={() => setActivePage?.('profile')}
          className={getButtonClass('profile')}
          style={activeStyle('profile')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </div>
        </button>

        {/* 12. Password */}
        <button
          onClick={() => setActivePage?.('password')}
          className={getButtonClass('password')}
          style={activeStyle('password')}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Password</span>
          </div>
        </button>

        {/* 13. Logout */}
        <button
          onClick={handleLogout}
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


export default Sidebar;