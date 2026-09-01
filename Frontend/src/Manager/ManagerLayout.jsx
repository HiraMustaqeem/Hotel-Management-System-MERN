import React, { useState } from "react";
import ManagerSidebar from "./ManagerSidebar"; 
import ManagerDashboard from "./ManagerDashboard";
import Logout from "../Registration/Logout";
import ManagerRoomsList from "./MRooms";
import MStaff from "./MStaff";
import ManagerServices from "./ManagerServices";
import ManagerProfile from "./ManagerProfile";
import MReport from "./MReport";
import MFeedback from "./MFeedback";
import MContact from "./MContact";
import MPassword from "./MPassword";

// REPORTS
import BookingsReport from "./Manager-Reports/BookingsReport";
import RoomsReport from "./Manager-Reports/RoomsReport";
import StaffReport from "./Manager-Reports/StaffReport";
import FeedbackReport from "./Manager-Reports/FeedbackReport";
import MaintenanceReport from "./Manager-Reports/MaintenanceReport";

const ManagerLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <ManagerDashboard />;
      case 'BookingsReport': return <BookingsReport />;
      case 'RoomsReport': return <RoomsReport />;
      case 'StaffReport': return <StaffReport />;
      case 'FeedbackReport': return <FeedbackReport />;
      case 'MaintenanceReport': return <MaintenanceReport />;
      case 'rooms': return <ManagerRoomsList />;
      case 'staff': return <MStaff />;
      case 'services': return <ManagerServices />;
      case 'profile': return <ManagerProfile />;
      case 'maintenance': return <MReport />;
      case 'feedbacks': return <MFeedback />;
      case 'contacts': return <MContact />;
      // case 'staff': return <div className="p-10 text-xl font-bold">Staff Management Page</div>;
      // case 'services': return <div className="p-10 text-xl font-bold">Services Page</div>;
      // case 'feedbacks': return <div className="p-10 text-xl font-bold">Guest Feedbacks</div>;
      // case 'profile': return <div className="p-10 text-xl font-bold">My Profile Page</div>;
      case 'password': return <MPassword />;
      case 'logout': return <Logout />;
      default: return <ManagerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar fixed rahega */}
      <ManagerSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default ManagerLayout;