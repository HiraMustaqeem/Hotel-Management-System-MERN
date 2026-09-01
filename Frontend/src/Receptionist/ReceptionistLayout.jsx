import React, { useState } from 'react';
import ReceptionistSidebar from './ReceptionistSidebar';
import AllBookings from './Receptionist-Bookings/AllBookings';
import AddBookings from './Receptionist-Bookings/AddBookings';
import ReceptionistBooking from './Receptionist-Reports/ReceptionistBooking';
import ReceptionistRooms from './Receptionist-Reports/ReceptionistRooms';
import DetailedRooms from './DetailedRooms';
import ReceptionistGuest from './ReceptionistGuest';
import RoomsAvailability from './RoomsAvailability';
import ReceptionistInvoices from './ReceptionistInvoices';
import ReceptionistServices from './ReceptionistServices'; 
import ReceptionistProfile from './ReceptionistProfile';
import ReceptionistPassword from './ReceptionistPassword';
import ReceptionistLogout from './ReceptionistLogout';
import ReceptionistDashboard from './ReceptionistDashboard';
import BookWalkIn from './Receptionist-Bookings/BookWalkIn';
import MaintenanceReport from './MaintenanceReport';

const ReceptionistLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <ReceptionistDashboard />;
      case 'total-guests': return <ReceptionistGuest />;
      case 'bookings-all': return <AllBookings />;
      case 'bookings-add': return (<AddBookings
        setSelectedRoom={setSelectedRoom}
        setActivePage={setActivePage}
      />);
      case 'book-walkin': return (
        <BookWalkIn
          selectedRoom={selectedRoom}
        />);

      // Navigation Mapping
      case 'rooms': return <DetailedRooms />; 
      case 'report-rooms': return <ReceptionistRooms />;
      case 'rooms-availability': return <RoomsAvailability />;
      case 'invoices': return <ReceptionistInvoices />;
      case 'ReceptionistServices': return <ReceptionistServices/>;
      case 'MaintenanceReport': return <MaintenanceReport/>;
      case 'profile': return <ReceptionistProfile />;
      case 'change-password': return <ReceptionistPassword />;
      case 'report-bookings': return <ReceptionistBooking />;
      case 'logout': return <ReceptionistLogout />;
      default: return <ReceptionistDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      <ReceptionistSidebar activePage={activePage} setActivePage={setActivePage} staffName="Zahid Khan" />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default ReceptionistLayout;