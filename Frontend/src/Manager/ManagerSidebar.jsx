import React, { useState } from 'react';

const ManagerSidebar = ({ setActivePage, activePage }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getButtonClass = (page) =>
    `w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${activePage === page ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-indigo-50'
    }`;

  const getSubButtonClass = (page) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${activePage === page ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  const Icon = ({ d }) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
    </svg>
  );

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-black text-indigo-700">Luxury Stay</h2>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Manager Portal</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {/* Main Links */}
        <button onClick={() => setActivePage('dashboard')} className={getButtonClass('dashboard')}>
          <div className="flex items-center gap-3"><Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> Dashboard</div>
        </button>

        {/* Reports Dropdown */}
        <div>
          <button onClick={() => toggleDropdown('reports')} className={getButtonClass('reports')}>
            <div className="flex items-center gap-3">
              <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              <span>Reports</span>
            </div>
            <svg className={`w-3 h-3 transition-transform ${openDropdown === 'reports' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'reports' ? 'max-h-80' : 'max-h-0'}`}>
            <div className="pt-2 pb-1 space-y-1 pl-8">
              <button onClick={() => setActivePage('BookingsReport')} className={getSubButtonClass('BokingsReport')}>                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Bookings
              </button>
              <button onClick={() => setActivePage('RoomsReport')} className={getSubButtonClass('RoomsReport')}>                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                Rooms
              </button>
              <button onClick={() => setActivePage('StaffReport')} className={getSubButtonClass('StaffReport')}>                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Staffs
              </button>
              <button onClick={() => setActivePage('FeedbackReport')} className={getSubButtonClass('FeedbackReport')}>                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Feedbacks
              </button>
              <button onClick={() => setActivePage('MaintenanceReport')} className={getSubButtonClass('MaintenanceReport')}>                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.567-.375-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                Maintenance
              </button>
            </div>
          </div>
        </div>

        {/* Operational Links */}
        <button onClick={() => setActivePage('rooms')} className={getButtonClass('rooms')}><div className="flex items-center gap-3"><Icon d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> Rooms</div></button>
        <button onClick={() => setActivePage('staff')} className={getButtonClass('staff')}><div className="flex items-center gap-3"><Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> Staff </div></button>
        <button onClick={() => setActivePage('services')} className={getButtonClass('services')}><div className="flex items-center gap-3">    <Icon d="M4 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM13 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V6zM4 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3zM13 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" /> Services</div></button>
        <button onClick={() => setActivePage('maintenance')} className={getButtonClass('maintenance')}><div className="flex items-center gap-3"><Icon d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.567-.375-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />Report Maintenance</div></button>
        <button onClick={() => setActivePage('feedbacks')} className={getButtonClass('feedbacks')}><div className="flex items-center gap-3"><Icon d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> Customer Feedback</div></button>
        <button
          onClick={() => setActivePage?.('contacts')}
          className={getButtonClass('contacts')}
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
        </button>        <button onClick={() => setActivePage('profile')} className={getButtonClass('profile')}><div className="flex items-center gap-3"><Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> Profile</div></button>
        <button onClick={() => setActivePage('password')} className={getButtonClass('password')}><div className="flex items-center gap-3"><Icon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> Manage Password</div></button>
        <button onClick={() => setActivePage('logout')} className={getButtonClass('logout')}><div className="flex items-center gap-3"><Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /> Logout</div></button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;