import React, { useState, useEffect } from 'react';
import API from "../../api/axios";
// =========================================================================
// 🏨 LIVE BOOKINGS REGISTRY DATA
// =========================================================================

const AllBookings = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [billGeneratedIds, setBillGeneratedIds] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loadingBillId, setLoadingBillId] = useState(null);
  
// changed
const [actionError, setActionError] = useState("");
const [actionSuccess, setActionSuccess] = useState("");

// Transfer Room Modal State
const [showTransferModal, setShowTransferModal] = useState(false);
const [transferBooking, setTransferBooking] = useState(null);

const [transferData, setTransferData] = useState({
  newRoomId: "",
  reason: ""
});

const [transferLoading, setTransferLoading] = useState(false);

const [availableRooms, setAvailableRooms] = useState([]);


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/booking/all-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // changed
      
// console.log(res.data.bookings[0]);
      const formattedBookings =
        res.data.bookings.map((booking) => ({

          id: booking._id,

          guestName:
            booking.guest?.name || "Guest",

          guestEmail:
            booking.guest?.email || "No Email",

          roomNumber:
            booking.room?.roomNumber || "N/A",

          roomType:
            booking.room?.roomType || "Room",

          checkIn:
            new Date(
              booking.checkInDate
            ).toLocaleDateString(),

          checkOut:
            new Date(
              booking.checkOutDate
            ).toLocaleDateString(),

          status: booking.status || "pending",

          amount:
            `PKR ${booking.totalPrice}`,

          services:
            booking.services || [],

            // changed
    billGenerated:
      booking.billGenerated || false

        }));

      setBookingsList(
        formattedBookings
      );

    } catch (error) {

      console.log(error);

    }
  };

  const [statusFilter, setStatusFilter] = useState("all");

const filteredBookings = bookingsList.filter((b) => {
  if (statusFilter === "all") return true;
  return b.status.toLowerCase() === statusFilter;
});

  const countConfirmed =
    bookingsList.filter((b) => b.status === 'confirmed').length;

  const countPending =
    bookingsList.filter((b) => b.status === 'pending').length;

  const countCheckIn =
    bookingsList.filter((b) => b.status === 'checked_in').length;

  const countCheckOut =
    bookingsList.filter((b) => b.status === 'checked_out').length;

  const countCancelled =
    bookingsList.filter((b) => b.status === 'cancelled').length;


  const getStatusStyles = (status) => {

    switch (status?.toLowerCase()) {

      case 'checked_in':
        return 'bg-blue-50 text-blue-700 border-blue-100/70';

      case 'checked_out':
        return 'bg-purple-50 text-purple-700 border-purple-100/70';

      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100/70';

      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100/70';

      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100/70';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

const getAllowedActions = (
  status,
  bookingId,
  billGenerated
) => {

  const s = status?.toLowerCase();

  // HIDE MENU IF BILL GENERATED
  if (
    billGenerated ||
    billGeneratedIds.includes(bookingId)
  ) {
    return [];
  }

  switch (s) {

    case "pending":
      return ["confirmed", "cancelled"];

    case "confirmed":
      return ["checked_in", "cancelled"];

    case "checked_in":
      return ["checked_out", "Transfer Room"];

    case "checked_out":
      return ["generate_bill"];

    default:
      return [];
  }
};


 const updateStatus = async (action, id) => {

  try {

    setActionError("");
    setActionSuccess("");

    const token = localStorage.getItem("token");

    let endpoint = "";

    switch (action.toLowerCase()) {

      case "confirmed":
        endpoint = `/booking/confirm-booking/${id}`;
        break;

      case "cancelled":
        endpoint = `/booking/cancel-booking/${id}`;
        break;

      case "checked_in":
        endpoint = `/booking/checkin/${id}`;
        break;

      case "checked_out":
        endpoint = `/booking/checkout/${id}`;
        break;

      default:
        return;
    }

    const res = await API.patch(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

 setActionSuccess(res.data.msg);

setTimeout(() => {
  setActionSuccess("");
}, 3000);

    fetchBookings();

  } catch (error) {

    const message =
      error?.response?.data?.msg ||
      "Something went wrong";

    setActionError(message);

    setTimeout(() => {
      setActionError("");
    }, 4000);
  }
};



const generateBill = async (bookingId) => {

  try {

    setActionError("");
    setActionSuccess("");

    setLoadingBillId(bookingId);

    const token = localStorage.getItem("token");

    const res = await API.post(
      "/billing/generate",
      { bookingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // SUCCESS MESSAGE
    setActionSuccess(res.data.msg);

    setTimeout(() => {
      setActionSuccess("");
    }, 3000);

    // OPTIONAL UI STATE
    setBillGeneratedIds((prev) => [
      ...prev,
      bookingId
    ]);

    fetchBookings();

  } catch (error) {

    // ERROR MESSAGE
    const message =
      error?.response?.data?.msg ||
      "Failed to generate bill";

    setActionError(message);

    setTimeout(() => {
      setActionError("");
    }, 4000);
    

  } finally {

    setLoadingBillId(null);

  }
};


// FETCH AVAILABLE ROOM 
const fetchAvailableRooms = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/room/available", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setAvailableRooms(res.data.rooms || []);
  } catch (error) {
    console.log(error);
  }
};

// TRANSFER ROOM ACTION
const openTransferModal = (booking) => {
  setTransferBooking(booking);

  setTransferData({
    newRoomId: "",
    reason: ""
  });

  fetchAvailableRooms();
  setShowTransferModal(true);
};


const handleTransferRoom = async () => {
  try {
    if (!transferData.newRoomId) {
      return alert("Please select a new room");
    }

    setTransferLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.post(
      `/booking/transfer-room/${transferBooking.id}`,
      {
        newRoomId: transferData.newRoomId,
        reason: transferData.reason
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(res.data.msg);

    setShowTransferModal(false);
    fetchBookings();

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.msg ||
      "Transfer failed"
    );
  } finally {
    setTransferLoading(false);
  }
};

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased">

      {/* Header Panel */}
      <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-200/60 flex flex-col gap-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Luxury Stay Hotel <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Bookings Registry</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage room allocation workflows, monitor immediate checkout schedules, and track housekeeping priorities.
            </p>
          </div>
        </div>

        {/* changed */}
        {actionError && (
  <div className="max-w-7xl mx-auto mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm font-bold">
    {actionError}
  </div>
)}

{actionSuccess && (
  <div className="max-w-7xl mx-auto mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-bold">
    {actionSuccess}
  </div>
)}

        {/* Dropdown Navigation Operations Filter */}
        {/* STATUS FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2 mt-2">

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'all'
                ? 'bg-[rgb(94,74,247)] text-white border-[rgb(94,74,247)]'
                : 'bg-white text-slate-600 border-slate-200'
              }`}
          >
            All ({bookingsList.length})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'pending'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}
          >
            Pending ({countPending})
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'confirmed'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}
          >
            Confirmed ({countConfirmed})
          </button>

          <button
            onClick={() => setStatusFilter('checked_in')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'checked_in'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}
          >
            Check-In ({countCheckIn})
          </button>

          <button
            onClick={() => setStatusFilter('checked_out')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'checked_out'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-purple-50 text-purple-700 border-purple-100'
              }`}
          >
            Check-Out ({countCheckOut})
          </button>

          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${statusFilter === 'cancelled'
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
          >
            Cancelled ({countCancelled})
          </button>

        </div>
      </div>

      {/* Grid Dashboard Render */}
      {filteredBookings.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const styles = getStatusStyles(booking.status);
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between relative shadow-[0_4px_20px_-4px_rgba(148,163,184,0.06)] hover:shadow-[0_10px_30px_-6px_rgba(148,163,184,0.12)] transition-all duration-300 group border-slate-100 ${isCancelled ? 'opacity-70 bg-slate-50/50' : ''
                  }`}
              >

                {/* Top Module Segment */}
                <div>
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${booking.status === 'Cancelled'
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-indigo-50/50 border-indigo-100 text-[rgb(94,74,247)]'
                        }`}>

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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>

                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          {booking.id}
                        </span>

                        <h3 className={`text-base font-black text-slate-900 tracking-tight mt-0.5 ${isCancelled
                            ? 'line-through text-slate-400'
                            : ''
                          }`}>
                          {booking.roomNumber}
                        </h3>
                      </div>

                    </div>

                    {/* THREE DOTS MENU */}
{getAllowedActions(
  booking.status,
  booking.id,
  booking.billGenerated
).length > 0 && (                      <div className="relative">

                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === booking.id ? null : booking.id
                            )
                          }
                          className="w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                        >
                          <svg
                            className="w-5 h-5 text-slate-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6h.01M12 12h.01M12 18h.01"
                            />
                          </svg>
                        </button>

                        {openMenuId === booking.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">

                            {getAllowedActions(
  booking.status,
  booking.id,
  booking.billGenerated
).map((action, index) => (
                              <button
                                key={index}
                              onClick={() => {
  const actionLower = action.toLowerCase();

if (actionLower === "generate_bill") {
  generateBill(booking.id);
} 
else if (actionLower === "transfer room") {
  openTransferModal(booking);
}
else {
  updateStatus(actionLower, booking.id);
}

  setOpenMenuId(null);
}}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-b-0"
                              >
                                {action}
                              </button>
                            ))}

                          </div>
                        )}
                      </div>
                    )}</div>

                  {/* Room Type Tag Specification */}
                  <div className="mt-3">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {booking.roomType}
                    </span>
                  </div>

                  {/* Primary Guest Details */}
                  <div className="mt-5 border-t border-slate-100 pt-4 space-y-2">
                    <div className="text-xs">
                      <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Primary Guest</span>
                      <span className={`font-bold text-slate-800 text-sm block mt-0.5 ${isCancelled ? 'text-slate-400' : ''}`}>{booking.guestName}</span>
                      <span className="text-slate-500 text-[11px] font-medium block truncate">{booking.guestEmail}</span>
                    </div>

                    {/* Check In / Out Time Matrix */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Check-In</span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-slate-700 font-bold text-xs">
                            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {booking.checkIn}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Check-Out</span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-slate-700 font-bold text-xs">
                            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {booking.checkOut}
                          </div>
                        </div>
                      </div>


                      {/* SERVICES */}
                      {booking.services?.length > 0 && (

                        <div className="pt-2 border-t border-slate-200/50">

                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                            Services
                          </span>

                          <div className="flex flex-wrap gap-2">

                            {booking.services.map((service, index) => (

                              <span
                                key={index}
                                className="px-2 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100"
                              >
                                {service?.serviceId?.name || "Room Service"}
                              </span>

                            ))}

                          </div>

                        </div>
                      )}
                      {/* Status Component */}
                      <div className="pt-2 border-t border-slate-200/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Room Status</span>
                        <div className={`w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider py-1.5 rounded-lg border ${styles}`}>
                          <span className={`w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' :
                            booking.status === 'checked_in' ? 'bg-blue-500' :
                              booking.status === 'checked_out' ? 'bg-purple-500' :
                                booking.status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                            }`}></span>
                          {booking.status.replace(/_/g, '-')}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>



                {/* Bottom Total Amount Statement Module */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{isCancelled ? 'Cancelled Value:' : 'Total Gross Invoice:'}</span>
                  </div>
                  <span className={`text-sm font-black tracking-tight font-mono ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {booking.amount}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Vector Screen Exception */
        <div className="max-w-md mx-auto text-center py-16 px-4 rounded-3xl ">
          <div className="w-12 h-12 rounded-xlflex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-base font-black text-slate-900">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are no room profiles registered with this filter condition right now.
          </p>
        </div>
      )}
{showTransferModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

    <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-[rgb(94,74,247)] px-6 py-5 text-white">
        <h2 className="text-xl font-black">Room Transfer</h2>
        <p className="text-xs text-indigo-100 mt-1">
          Move guest to another available room
        </p>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-5">

        {/* Current Room */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Current Room
          </label>

          <input
            value={transferBooking?.roomNumber}
            disabled
            className="w-full mt-2 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 font-bold"
          />
        </div>

        {/* New Room Dropdown */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Select New Room
          </label>

          <select
            value={transferData.newRoomId}
            onChange={(e) =>
              setTransferData({
                ...transferData,
                newRoomId: e.target.value
              })
            }
            className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-indigo-500"
          >
            <option value="">Select available room</option>

            {availableRooms.map((room) => (
              <option key={room._id} value={room._id}>
                Room {room.roomNumber} - {room.roomType}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Reason (optional)
          </label>

          <textarea
            value={transferData.reason}
            onChange={(e) =>
              setTransferData({
                ...transferData,
                reason: e.target.value
              })
            }
            rows={3}
            placeholder="e.g. AC issue, guest request..."
            className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t flex gap-3">

        <button
          onClick={() => setShowTransferModal(false)}
          className="flex-1 py-3 rounded-2xl border font-bold text-gray-600"
        >
          Cancel
        </button>

        <button
          onClick={handleTransferRoom}
          disabled={transferLoading}
          className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-black disabled:opacity-60"
        >
          {transferLoading ? "Transferring..." : "Confirm Transfer"}
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default AllBookings;