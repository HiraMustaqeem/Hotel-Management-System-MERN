import React, { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
const BookWalkIn = ({ selectedRoom }) => {

    // console.log("ROOM DATA:", selectedRoom);
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);

    const [loading, setLoading] = useState(false);

    const [currentImage, setCurrentImage] = useState(0);
    const isRoomBlocked = selectedRoom.status !== "available";
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        checkin: "",
        checkout: "",
        services: [],
        preferences: ''
    });

    const [estimatedTotal, setEstimatedTotal] = useState(0);
    const [isBooked, setIsBooked] = useState(false);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsServicesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // FETCH SERVICES
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



    // AUTO IMAGE SLIDER
    useEffect(() => {

        if (
            selectedRoom?.roomImages &&
            selectedRoom.roomImages.length > 1
        ) {

            const interval = setInterval(() => {

                setCurrentImage((prev) =>
                    prev === selectedRoom.roomImages.length - 1
                        ? 0
                        : prev + 1
                );

            }, 3000);

            return () => clearInterval(interval);
        }

    }, [selectedRoom]);



    // ESTIMATE TOTAL CALCULATION
    useEffect(() => {

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

        // AGAR DATES SELECT HAIN
        if (
            formData.checkin &&
            formData.checkout &&
            selectedRoom
        ) {

            const date1 = new Date(formData.checkin);
            const date2 = new Date(formData.checkout);

            const timeDiff =
                date2.getTime() - date1.getTime();

            const days = Math.ceil(
                timeDiff / (1000 * 3600 * 24)
            );

            if (days > 0) {

                // ROOM PRICE × DAYS
                let basePrice =
                    Number(selectedRoom.price) * days;

                // SERVICES SIRF 1 TIME ADD
                setEstimatedTotal(
                    basePrice + servicesTotal
                );

            } else {

                setEstimatedTotal(
                    Number(selectedRoom?.price || 0)
                );

            }

        } else {

            // DEFAULT ROOM PRICE
            setEstimatedTotal(
                Number(selectedRoom?.price || 0) +
                servicesTotal
            );

        }

    }, [
        formData.checkin,
        formData.checkout,
        selectedServices,
        services,
        selectedRoom
    ]);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // HANDLE SERVICE SELECT
    const handleCheckboxChange = (serviceId) => {

        if (selectedServices.includes(serviceId)) {

            setSelectedServices(
                selectedServices.filter(
                    (id) => id !== serviceId
                )
            );

        } else {

            setSelectedServices([
                ...selectedServices,
                serviceId,
            ]);

        }
    };

    // TOGGLE DESCRIPTION
    const toggleDropdown = (serviceId) => {

        setOpenDropdown(
            openDropdown === serviceId
                ? null
                : serviceId
        );
    };

    const toggleServiceSelection = (serviceName) => {

        setFormData((prev) => {

            const isAlreadySelected = prev.services.includes(serviceName);

            let updatedServices;

            if (isAlreadySelected) {

                updatedServices = prev.services.filter(
                    (item) => item !== serviceName
                );

            } else {

                updatedServices = [...prev.services, serviceName];
            }

            return {
                ...prev,
                services: updatedServices
            };
        });
    };



    const handleBookingSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const payload = {

                room: selectedRoom._id,

                checkInDate: formData.checkin,

                checkOutDate: formData.checkout,

                name: formData.name,

                email: formData.email,

                contactNumber: formData.contactNumber,

                preferences: formData.preferences
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item !== ''),

                services: services
                    .filter((service) =>
                        selectedServices.includes(service._id)
                    )
                    .map((service) => ({
                        serviceId: service._id,
                        name: service.name,
                        price: service.price,
                    }))
            };

            console.log("WALK-IN PAYLOAD:", payload);

            const token = localStorage.getItem("token");

            const response = await API.post(
                "/guest/create-walkin",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.msg);

            setIsBooked(true);

        } catch (error) {

            console.log(error.response);
            alert(
                error?.response?.data?.msg ||
                "Booking failed"
            );

        } finally {

            setLoading(false);

        }
    };

    if (!selectedRoom) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-700">
                    No Room Selected
                </h2>
            </div>
        );
    }





    return (
        <div className="space-y-6 animate-fade-in pb-12">

            {/* HEADER */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Walk-In Guest Reservation
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Configure guest booking session for selected luxury suite.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT ROOM DETAIL CARD */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">

                    <div className="relative h-72 overflow-hidden">

                        <img
                            src={`http://localhost:5000${selectedRoom.roomImages?.[
                                selectedRoom.roomImages.length > 1
                                    ? currentImage
                                    : 0
                            ]}`}
                            alt={selectedRoom.roomType}
                            className="w-full h-full object-cover transition-all duration-700"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

                        {/* SLIDER DOTS */}
                        {selectedRoom.roomImages?.length > 1 && (

                            <div className="absolute bottom-4 right-4 flex gap-2 z-20">

                                {selectedRoom.roomImages.map((_, index) => (

                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`rounded-full transition-all

                ${currentImage === index
                                                ? "w-7 h-2 bg-white"
                                                : "w-2 h-2 bg-white/50"
                                            }
                `}
                                    />

                                ))}

                            </div>
                        )}

                        {/* LEFT BUTTON */}
                        {selectedRoom.roomImages?.length > 1 && (

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        prev === 0
                                            ? selectedRoom.roomImages.length - 1
                                            : prev - 1
                                    )
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white text-xl"
                            >
                                ‹
                            </button>
                        )}

                        {/* RIGHT BUTTON */}
                        {selectedRoom.roomImages?.length > 1 && (

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        prev === selectedRoom.roomImages.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white text-xl"
                            >
                                ›
                            </button>
                        )}

                        <div className="absolute top-4 left-4">
                            <span className="bg-white/95 text-slate-900 font-black px-4 py-2 rounded-xl text-xs shadow">
                                ROOM #{selectedRoom.roomNumber}
                            </span>
                        </div>

                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider
                            
                            ${selectedRoom.status === "available"
                                    ? "bg-emerald-500 text-white"
                                    : selectedRoom.status === "cleaning"
                                        ? "bg-yellow-400 text-black"
                                        : "bg-red-500 text-white"
                                }
                            
                            `}>
                                {selectedRoom.status}
                            </span>
                        </div>

                    </div>

                    <div className="p-6 space-y-5">

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 capitalize">
                                {selectedRoom.roomType}
                            </h2>

                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                {selectedRoom.description}
                            </p>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-5">

                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-semibold">
                                    Guest Capacity
                                </span>

                                <span className="text-slate-800 font-bold">
                                    {selectedRoom.capacity} Guests
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-semibold">
                                    Price / Night
                                </span>

                                <span className="text-2xl font-black text-[rgb(94,74,247)]">
                                    PKR {selectedRoom.price?.toLocaleString()}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT FORM */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">

                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-7">
                        Guest Booking Information
                    </h3>

                    {isBooked ? (

                        <div className="p-10 rounded-3xl bg-emerald-50 border border-emerald-100 text-center space-y-4">

                            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">

                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>

                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-emerald-700">
                                    Booking Confirmed
                                </h2>

                                <p className="text-sm text-emerald-600 mt-1">
                                    Guest reservation session successfully created.
                                </p>
                            </div>

                        </div>

                    ) : (

                        <form
                            onSubmit={handleBookingSubmit}
                            className="space-y-6"
                        >

                            {/* NAME + PHONE */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-500">
                                        Guest Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-[rgb(94,74,247)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-500">
                                        Contact Number
                                    </label>

                                    <input
                                        type="tel"
                                        required
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        placeholder="03XX XXXXXXX"
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-[rgb(94,74,247)]"
                                    />
                                </div>

                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">

                                <label className="text-xs uppercase font-bold text-slate-500">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="guest@email.com"
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-[rgb(94,74,247)]"
                                />

                            </div>

                            {/* DATES */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-500">
                                        Check-In
                                    </label>

                                    <input
                                        type="date"
                                        required
                                        name="checkin"
                                        value={formData.checkin}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-500">
                                        Check-Out
                                    </label>

                                    <input
                                        type="date"
                                        required
                                        name="checkout"
                                        value={formData.checkout}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                                    />
                                </div>

                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Guest Preferences
                                </label>

                                <input
                                    type="text"
                                    name="preferences"
                                    value={formData.preferences}
                                    onChange={handleInputChange}
                                    placeholder="Sea View, Spa, Extra Pillow"
                                    className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all"
                                />

                                <p className="text-[11px] text-slate-400">
                                    Separate multiple preferences using commas
                                </p>
                            </div>

                            {/* SERVICES */}
                            <div className="mb-2">

                                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                    Additional Services
                                </label>

                                <div className="max-h-72 overflow-y-auto pr-1 space-y-3">

                                    {services.map((service) => (

                                        <div
                                            key={service._id}
                                            className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50"
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

                                                        <h4 className="font-bold text-slate-900 text-sm">
                                                            {service.name}
                                                        </h4>

                                                        <p className="text-xs text-[rgb(94,74,247)] font-bold">
                                                            +PKR {service.price}
                                                        </p>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDropdown(service._id)
                                                    }
                                                    className="text-slate-400 text-xs"
                                                >
                                                    ▼
                                                </button>

                                            </div>

                                            {openDropdown === service._id && (

                                                <div className="px-4 pb-4 text-sm text-slate-500 bg-white border-t border-slate-100">

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
                                    <p className="text-indigo-100 text-sm uppercase tracking-[3px] font-bold">
                                        Estimated Total
                                    </p>

                                    <p className="text-[11px] text-slate-100 mt-1">
                                        Calculated with stay duration + services
                                    </p>
                                </div>

                                <h3 className="text-white text-4xl font-black mt-1">
                                    PKR {estimatedTotal.toLocaleString()}
                                </h3>

                            </div>



                            {/* ROOM STATUS ALERTS */}

                            {selectedRoom.status === "cleaning" && (

                                <div className="flex items-start gap-3 p-4 rounded-2xl border border-yellow-200 bg-yellow-50">

                                    <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0">

                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>

                                    </div>

                                    <div>
                                        <h4 className="font-black text-yellow-700 text-sm uppercase">
                                            Room Under Cleaning
                                        </h4>

                                        <p className="text-xs text-yellow-600 mt-1 leading-relaxed">
                                            This suite is currently being cleaned and prepared for the next guest session.
                                        </p>
                                    </div>

                                </div>

                            )}

                            {selectedRoom.status === "maintenance" && (

                                <div className="flex items-start gap-3 p-4 rounded-2xl border border-orange-200 bg-orange-50">

                                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">

                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.983 5.5v6m0 4h.01"
                                            />
                                        </svg>

                                    </div>

                                    <div>
                                        <h4 className="font-black text-orange-700 text-sm uppercase">
                                            Maintenance In Progress
                                        </h4>

                                        <p className="text-xs text-orange-600 mt-1 leading-relaxed">
                                            This room is temporarily unavailable due to technical or maintenance operations.
                                        </p>
                                    </div>

                                </div>

                            )}

                            {selectedRoom.status === "occupied" && (

                                <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50">

                                    <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">

                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                                            />
                                        </svg>

                                    </div>

                                    <div>
                                        <h4 className="font-black text-red-700 text-sm uppercase">
                                            Room Currently Occupied
                                        </h4>

                                        <p className="text-xs text-red-600 mt-1 leading-relaxed">
                                            Another guest is currently checked into this room. Walk-in reservation is unavailable.
                                        </p>
                                    </div>

                                </div>

                            )}
                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={isRoomBlocked || loading}
                                className={`w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all active:scale-[0.99]

    ${isRoomBlocked
                                        ? "bg-slate-300 cursor-not-allowed opacity-70"
                                        : "bg-black hover:opacity-90"
                                    }
    `}
                            >
                                {
                                    loading
                                        ? "PROCESSING BOOKING..."
                                        : isRoomBlocked
                                            ? "ROOM UNAVAILABLE"
                                            : "CONFIRM WALK-IN BOOKING"
                                }
                            </button>

                        </form>

                    )}

                </div>

            </div>

        </div>
    );
};

export default BookWalkIn;