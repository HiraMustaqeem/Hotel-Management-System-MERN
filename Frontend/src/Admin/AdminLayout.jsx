import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../Admin/Dashboard';
// ✨ REPORTS FOLDER COMPONENTS IMPORTS
// ==========================================
import BookingsReport from './Reports/BookingsReport';
import RoomsReport from './Reports/RoomsReport';
import StaffReport from './Reports/StaffReport';
import FeedbackReport from './Reports/FeedbackReport';
import MaintenanceReport from './Reports/MaintenanceReport';
import Guests from './Guests.jsx';

// ✅ Rooms configuration imports
import AddRooms from './Rooms/Add-Room';
import AllRooms from './Rooms/All-Rooms';

// ==========================================
// 💼 STAFF MANAGEMENT FOLDER IMPORTS
// ==========================================
import AddStaff from './Staff/AddStaff';
import AllStaff from './Staff/AllStaff';

// ==========================================
// 📅 BOOKINGS FOLDER IMPORTS (NEWly ADDED)
// ==========================================

// //////////////// Feedbaack import

import AdminFeedback from './AdminFeedback';
import AdminContact from './AdminContact';
import AdminMaintenance from './AdminMaintenance';
import AdminSettings from './AdminSettings';
import AdminProfile from './AdminProfile';
import AdminPassword from './AdminPassword';
import AdminLogin from '../Registration/ManagementLogin';
import AddService from './Services/AddService';
import AllServices from './Services/AllServices';
import AllBookings from './Bookings';


const AdminLayout = () => {
  // State jo active page track karegi
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex bg-slate-900 min-h-screen">
      {/* Sidebar component */}
      <Sidebar setActivePage={setActivePage} activePage={activePage} />

      {/* Right side ka main content area */}
      <main className="flex-1 text-white overflow-y-auto h-screen">

        {/* Main Admin Dashboard Home */}
        {activePage === 'dashboard' && <Dashboard />}

        {/* ==========================================
            ✨ REPORTS FOLDER PAGES (SYNCHRONIZED WITH SIDEBAR)
           ========================================== */}
        {/* 1. Bookings Report */}
        {activePage === 'report-bookings' && <BookingsReport />}

        {/* 2. Rooms Report */}
        {activePage === 'report-rooms' && <RoomsReport />}

        {/* 3. Staff Report */}
        {activePage === 'report-staffs' && <StaffReport />}

        {/* 4. Feedbacks Report */}
        {activePage === 'report-feedbacks' && <FeedbackReport />}

        {/* 5. Maintenance Report */}
        {activePage === 'report-maintenance' && <MaintenanceReport />}

        {/* services */}
        {activePage === 'add-services' && <AddService />}
        {activePage === 'all-services' && <AllServices />}

        {/* ==========================================
            👑 Guests MANAGEMENT
           ========================================== */}
        {activePage === 'guests' && <Guests />}

        {/* ==========================================
            🏨 ROOMS INVENTORY MANAGEMENT
           ========================================== */}
        {/* 1. Add Room Section */}
        {(activePage === 'add-room' || activePage === 'addroom') && <AddRooms />}

        {/* 2. All Rooms Section */}
        {(activePage === 'all-room' || activePage === 'allroom' || activePage === 'all-rooms' || activePage === 'rooms-dashboard') && <AllRooms />}

        {/* ==========================================
            💼 STAFF MANAGEMENT ROUTING
           ========================================== */}
        {/* 1. All Staff Directory */}
        {(activePage === 'all-staff' || activePage === 'allstaff') && <AllStaff />}

        {/* 2. Add New Staff Member Form */}
        {(activePage === 'add-staff' || activePage === 'addstaff') && <AddStaff />}

        {/* ==========================================
            📅 BOOKINGS MANAGEMENT ROUTING (CALLING AllBookings)
           ========================================== */}
        {(activePage === 'bookings' || activePage === 'bookings' || activePage === 'bookings') && <AllBookings />}

        {/* ✅ ADMIN FEEDBACK ROUTE CONDITION */}
        {(activePage === 'feedback' || activePage === 'feedbacks' || activePage === 'FeedbackReport' || activePage === 'report-feedbacks') && <AdminFeedback />}

        {/* ✅ ADMIN FEEDBACK ROUTE CONDITION */}
      {(activePage === 'contact' || activePage === 'contacts' || activePage === 'AdminContact' || activePage === 'contacts') && <AdminContact />}


        {/* ✅ ADMIN MAINTENANCE ROUTE CONDITION */}
        {(activePage === 'maintenance' || activePage === 'maintenances' || activePage === 'adminmaintenance') && <AdminMaintenance />}

        {/* ✅ ADMIN SYSTEM SETTINGS ROUTE CONDITION */}
        {(activePage === 'settings' || activePage === 'systemsettings' || activePage === 'adminsettings' || activePage === 'settingsadmin') && <AdminSettings />}

        {/* ✅ ADMIN ACCOUNT PROFILE ROUTE CONDITION */}
        {(activePage === 'profile' || activePage === 'adminprofile' || activePage === 'accountprofile' || activePage === 'profiles') && <AdminProfile />}


        {/* 🔒 ADMIN PASSWORD UPDATE ENGINE CONDITION */}
        {(activePage === 'password' || activePage === 'adminpassword' || activePage === 'security' || activePage === 'changepassword') && <AdminPassword />}


        {/* 🔒 ADMIN LOGIN ENGINE CONDITION */}
        {(activePage === 'login' || activePage === 'adminlogin' || activePage === 'signin') && <AdminLogin />}

      </main>
    </div>
  );
};

export default AdminLayout;