import React from 'react';

const HousekeepingSidebar = ({ setActivePage, activePage }) => {
  const getButtonClass = (page) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activePage === page ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-indigo-50'
    }`;

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-black text-indigo-700">Luxury Stay</h2>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Housekeeping Portal</p>
      </div>

      <div className="flex-1 space-y-2">
        <button onClick={() => setActivePage('dashboard')} className={getButtonClass('dashboard')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Dashboard
        </button>
        <button onClick={() => setActivePage('rooms')} className={getButtonClass('rooms')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          Rooms 
        </button>
        <button onClick={() => setActivePage('profile')} className={getButtonClass('profile')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          My Profile
        </button>
        <button onClick={() => setActivePage('password')} className={getButtonClass('password')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Change Password
        </button>
        <button onClick={() => setActivePage('maintenance')} className={getButtonClass('maintenance')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Report Maintenance
        </button>
      </div>

    <button
  onClick={() => setActivePage?.('logout')}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-[0.98]"
>
  <svg
    className="w-5 h-5 text-rose-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>

  <span>Logout</span>
</button>
    </aside>
  );
};

export default HousekeepingSidebar;