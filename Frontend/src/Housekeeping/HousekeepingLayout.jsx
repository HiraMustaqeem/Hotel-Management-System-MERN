import React, { useState } from "react";
import HousekeepingSidebar from "./HousekeepingSidebar";
import HousekeepingDashboard from "./HousekeepingDashboard";
import HousekeepingRooms from "./HousekeepingRooms";
import HousekeepingProfile from "./HousekeepingProfile";
import HousekeepingPassword from "./HousekeepingPassword"
import HousekeepingMaintainance from "./HousekeepingMaintainance";
import Logout from "../Registration/Logout";

const HousekeepingLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <HousekeepingDashboard />;
      case 'rooms': return <HousekeepingRooms />;
      case 'profile': return <HousekeepingProfile  />  ;
      case 'password': return <HousekeepingPassword /> ;
      case 'maintenance': return  <HousekeepingMaintainance/>   ;
      case 'logout': return <Logout />;
      default: return <HousekeepingDashboard />;

     
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <HousekeepingSidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default HousekeepingLayout;