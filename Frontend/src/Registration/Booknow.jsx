import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  BrushCleaning,
  Wrench,
  BedDouble
} from "lucide-react";
function BookNow() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    // =========================
    // ROOM DATA
    // =========================
    const room = location.state?.room;

    // =========================
    // FORM STATE
    // =========================
    const [bookingData, setBookingData] = useState({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
    });

    // =========================
    // SERVICES STATE
    // =========================
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);

    const [loading, setLoading] = useState(false);
    const isCleaning = room.status?.toLowerCase() === "cleaning";
    const isMaintenance = room.status?.toLowerCase() === "maintenance";
    const isOccupied = room.status?.toLowerCase() === "occupied";
    // =========================
    // FETCH CURRENT LOGGED USER
    // =========================
    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const response = await API.get("/guest/my-profile");

                console.log("PROFILE DATA:", response.data);

                const guest = response.data.guest;

                setBookingData((prev) => ({
                    ...prev,
                    clientName: guest.name || "",
                    clientEmail: guest.email || "",
                    clientPhone: guest.contactNumber || "",
                }));

            } catch (error) {

                console.log("User fetch error:", error);

            }
        };

        fetchCurrentUser();

    }, []);


    // =========================
    // AUTO SLIDER
    // =========================
    useEffect(() => {

        if (
            room?.roomImages &&
            room.roomImages.length > 1
        ) {

            const interval = setInterval(() => {

                setCurrentImage((prev) =>
                    prev === room.roomImages.length - 1
                        ? 0
                        : prev + 1
                );

            }, 3000);

            return () => clearInterval(interval);
        }

    }, [room]);

    // =========================
    // FETCH SERVICES
    // =========================
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await API.get(
                    "/service/all",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setServices(response.data.services);

            } catch (error) {
                console.log("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // HANDLE SERVICE SELECT
    // =========================
    const handleCheckboxChange = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(
                selectedServices.filter((id) => id !== serviceId)
            );
        } else {
            setSelectedServices([
                ...selectedServices,
                serviceId,
            ]);
        }
    };

    // =========================
    // TOGGLE DROPDOWN
    // =========================
    const toggleDropdown = (serviceId) => {
        setOpenDropdown(
            openDropdown === serviceId ? null : serviceId
        );
    };

    // =========================
    // TOTAL CALCULATION
    // =========================
    const calculateTotal = () => {

        const roomPrice = Number(room?.price || 0);

        // DAYS CALCULATION
        let totalDays = 1;

        if (bookingData.checkIn && bookingData.checkOut) {

            const checkIn = new Date(bookingData.checkIn);
            const checkOut = new Date(bookingData.checkOut);

            const diffTime =
                checkOut.getTime() - checkIn.getTime();

            totalDays = Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            );

            if (totalDays <= 0) {
                totalDays = 1;
            }
        }

        // ROOM TOTAL
        const roomTotal = roomPrice * totalDays;

        // SERVICES TOTAL (ONE TIME ONLY)
        const servicesTotal = services
            .filter((service) =>
                selectedServices.includes(service._id)
            )
            .reduce(
                (sum, service) =>
                    sum + Number(service.price || 0),
                0
            );

        return roomTotal + servicesTotal;
    };

    // =========================
    // SUBMIT BOOKING
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!room?._id) {
            alert("Room not found!");
            return;
        }


        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const selectedServiceData = services
                .filter((service) =>
                    selectedServices.includes(service._id)
                )
                .map((service) => ({
                    serviceId: service._id,   // 👈 IMPORTANT FIX
                    price: service.price,
                }));

            const payload = {
                room: room._id,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut,
                guests: bookingData.guests,
                services: selectedServiceData,
            };

            console.log("BOOKING PAYLOAD:", payload);

            await API.post(
                "/booking/self-book",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Booking Successful!");

            navigate("/rooms");

        } catch (error) {
            console.log(error);

            alert(
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                "Booking failed"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // NO ROOM SELECTED
    // =========================
    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-bold">
                No Room Selected
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/* ========================================= */}
                {/* LEFT SIDE → ROOM DETAILS */}
                {/* ========================================= */}

                <div className="bg-white rounded-[30px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100">

                    {/* ROOM IMAGE */}
                    {/* <div className="relative h-[380px] overflow-hidden">
                        <img
                            src={`http://localhost:5000${room.roomImages?.[0]}`}
                            alt={room.roomType}
                            className="w-full h-full object-cover hover:scale-105 transition duration-700"
                        />

                        <div className="absolute top-6 right-6">
                            <span
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg
                                ${
                                    room.status === "Available"
                                        ? "bg-green-500 text-white"
                                        : room.status === "Booked"
                                        ? "bg-red-500 text-white"
                                        : "bg-amber-500 text-white"
                                }`}
                            >
                                {room.status}
                            </span>
                        </div>

                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl">
                            <span className="text-sm font-black text-gray-900">
                                Room #{room.roomNumber}
                            </span>
                        </div>
                    </div> */}


                    {/* ROOM IMAGE / SLIDER */}
                    <div className="relative h-[420px] overflow-hidden group">

                        {/* IMAGE */}
                        <img
                            src={`http://localhost:5000${room.roomImages?.[
                                room.roomImages.length > 1
                                    ? currentImage
                                    : 0
                                ]
                                }`}
                            alt={room.roomType}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />

                        {/* DARK OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

                        {/* STATUS */}
                        <div className="absolute top-6 right-6 z-10">
                            <span
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-md
            ${room.status === "available"
                                        ? "bg-green-500/90 text-white"
                                        : room.status === "booked"
                                            ? "bg-red-500/90 text-white"
                                            : "bg-amber-500/90 text-white"
                                    }`}
                            >
                                {room.status}
                            </span>
                        </div>

                        {/* ROOM NUMBER */}
                        <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl">
                            <span className="text-sm font-black text-gray-900 tracking-wide">
                                Room #{room.roomNumber}
                            </span>
                        </div>

                        {/* SLIDER DOTS */}
                        {room.roomImages?.length > 1 && (

                            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">

                                {room.roomImages.map((_, index) => (

                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`transition-all duration-300 rounded-full
                    ${currentImage === index
                                                ? "w-8 h-2 bg-white"
                                                : "w-2 h-2 bg-white/50"
                                            }`}
                                    />

                                ))}

                            </div>
                        )}

                        {/* LEFT BUTTON */}
                        {room.roomImages?.length > 1 && (

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        prev === 0
                                            ? room.roomImages.length - 1
                                            : prev - 1
                                    )
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xl font-black transition"
                            >
                                ‹
                            </button>
                        )}

                        {/* RIGHT BUTTON */}
                        {room.roomImages?.length > 1 && (

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        prev === room.roomImages.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xl font-black transition"
                            >
                                ›
                            </button>
                        )}

                    </div>

                    {/* ROOM CONTENT */}
                    <div className="p-8">

                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                                    {room.roomType}
                                </h2>

                                <p className="text-gray-500 mt-3 leading-relaxed">
                                    {room.description}
                                </p>
                            </div>

                            <div className="text-right">
                                <h3 className="text-3xl font-black text-indigo-600">
                                    PKR {room.price}
                                </h3>

                                <span className="text-xs uppercase tracking-[3px] text-gray-400 font-bold">
                                    Per Night
                                </span>
                            </div>
                        </div>

                        {/* FEATURES */}
                        <div className="grid grid-cols-2 gap-4 mt-8">

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                                    Capacity
                                </p>

                                <h4 className="text-xl font-black text-gray-900 mt-1">
                                    {room.capacity} Guests
                                </h4>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                                <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                                    Booking Status
                                </p>

                                <h4 className="text-xl font-black text-indigo-700 mt-1">
                                    {room.status}
                                </h4>
                            </div>

                        </div>

                    </div>
                </div>

                {/* ========================================= */}
                {/* RIGHT SIDE → BOOKING FORM */}
                {/* ========================================= */}

                <div className="bg-white rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-8">

                    <div className="mb-8">
                        <span className="text-indigo-600 font-bold uppercase tracking-[4px] text-xs">
                            Luxury Reservation
                        </span>

                        <h2 className="text-4xl font-black text-gray-900 mt-3">
                            Complete Your Booking
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Reserve your premium luxury stay now.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* NAME */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="clientName"
                                value={bookingData.clientName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* PHONE + EMAIL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                            <div>
                                <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="clientPhone"
                                    value={bookingData.clientPhone}
                                    onChange={handleChange}
                                    placeholder="+92 300 1234567"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="clientEmail"
                                    value={bookingData.clientEmail}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                        </div>

                        {/* DATES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                            <div>
                                <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                    Check In
                                </label>

                                <input
                                    type="date"
                                    name="checkIn"
                                    value={bookingData.checkIn}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                    Check Out
                                </label>

                                <input
                                    type="date"
                                    name="checkOut"
                                    value={bookingData.checkOut}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                        </div>

                        {/* GUESTS */}
                        {/* <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 ml-3 mb-2 uppercase tracking-wider">
                                Guests
                            </label>

                            <select
                                name="guests"
                                value={bookingData.guests}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                            >
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4+ Guests</option>
                            </select>
                        </div> */}

                        {/* SERVICES */}
                        <div className="mb-8">

                            <label className="block text-xs font-bold text-gray-400 ml-3 mb-3 uppercase tracking-wider">
                                Additional Services
                            </label>

                            <div className="max-h-72 overflow-y-auto pr-1 space-y-3">

                                {services.map((service) => (

                                    <div
                                        key={service._id}
                                        className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50"
                                    >

                                        <div className="flex items-center justify-between px-4 py-4">

                                            <div className="flex items-center gap-3">

                                                <input
                                                    type="checkbox"
                                                    checked={selectedServices.includes(service._id)}
                                                    onChange={() =>
                                                        handleCheckboxChange(service._id)
                                                    }
                                                    className="w-4 h-4"
                                                />

                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {service.name}
                                                    </h4>

                                                    <p className="text-xs text-indigo-500 font-bold">
                                                        +PKR {service.price}
                                                    </p>
                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleDropdown(service._id)
                                                }
                                                className="text-gray-400"
                                            >
                                                ▼
                                            </button>

                                        </div>

                                        {openDropdown === service._id && (
                                            <div className="px-4 pb-4 text-sm text-gray-500 bg-white border-t border-gray-100">
                                                {service.description}
                                            </div>
                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* TOTAL */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-6 flex items-center justify-between mb-8 shadow-xl">

                            <div>
                                <p className="text-indigo-100 text-xs uppercase tracking-[3px] font-bold">
                                    Estimated Total
                                </p>

                                <h3 className="text-white text-4xl font-black mt-1">
                                    PKR {calculateTotal()}
                                </h3>
                            </div>

                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">
                                    Luxury Stay
                                </span>
                            </div>

                        </div>
                        {/* CLEANING WARNING */}
                        {isCleaning && (

                            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">

    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
      <BrushCleaning className="w-5 h-5 text-amber-600" />
    </div>

                                <div>

                                    <h4 className="font-black text-amber-700 text-sm uppercase tracking-wide">
                                        Room Under Cleaning
                                    </h4>

                                    <p className="text-sm text-amber-600 mt-1 leading-relaxed">
                                        This room is currently being cleaned.
                                        Booking will be available once cleaning is completed.
                                    </p>

                                </div>

                            </div>

                        )}

                        {/* Maintenance WARNING */}
                        {isMaintenance && (

                            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">

    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
      <Wrench className="w-5 h-5 text-orange-600" />
    </div>
                                <div>

                                    <h4 className="font-black text-orange-700 text-sm uppercase tracking-wide">
                                        Room Under Maintenance
                                    </h4>

                                    <p className="text-sm  text-orange-600 mt-1 leading-relaxed">
                                        This room is temporarily unavailable due to technical or maintenance operations.
                                        Booking will be available once Maintenance is resolved.
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* isOccupied WARNING */}
                        {isOccupied && (

                            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">

    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
      <BedDouble className="w-5 h-5 text-red-600" />
    </div>

                                <div>

                                    <h4 className="font-black text-red-700 text-sm uppercase tracking-wide">
                                        Room Currently Occupied
                                    </h4>

                                    <p className="text-sm  text-red-600 mt-1 leading-relaxed">
                                        Another guest is currently checked into this room. Walk-in reservation is unavailable.
                                        Booking will be available once the room is vacated.
                                    </p>

                                </div>

                            </div>

                        )}

                        
                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading || isCleaning || isMaintenance || isOccupied}
                            className={`w-full py-4 rounded-full font-black uppercase tracking-[3px] text-sm transition-all duration-300 shadow-lg active:scale-95
                                ${isCleaning
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-gray-900 hover:bg-indigo-600 text-white",

                                isMaintenance
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-gray-900 hover:bg-indigo-600 text-white",

                                isOccupied
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-gray-900 hover:bg-indigo-600 text-white"
                                }`}
                        >
                            {
                                loading
                                    ? "Processing Booking..."
                                    : isCleaning || isMaintenance || isOccupied
                                        ? "Currently Unavailable"
                                        : "Confirm Booking"

                            }
                        </button>

                    </form>

                    <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
                        By confirming this booking you agree to hotel policies and terms.
                    </p>

                </div>

            </div>
        </div>
    );
}

export default BookNow;