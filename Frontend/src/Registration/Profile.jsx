import React, { useEffect, useState } from "react";
import API from "../api/axios";

import {
    Camera,
    Trash2,
    LogOut,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    BedDouble,
    BadgeCheck,
    Clock3,
    FileText
} from "lucide-react";

const Profile = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==============================
    // BOOKINGS STATES
    // ==============================

    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [showBookings, setShowBookings] = useState(true);

    // ==============================
    // INVOICES STATES
    // ==============================

    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);
    const [showInvoices, setShowInvoices] = useState(false);



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        address: "",
        preferences: "",
        profileImage: ""
    });

    
    // ==============================
    // CHANGE PASSWORD
    // ==============================

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordLoading, setPasswordLoading] = useState(false);

  // ==============================
    // REPORT MAINTENANCE ISSUE
    // ==============================

    const [maintenanceData, setMaintenanceData] = useState({
    roomId: "",
    issue: ""
});

const [maintenanceLoading, setMaintenanceLoading] = useState(false);

    // ==============================
    // GET PROFILE
    // ==============================
    const fetchMyProfile = async () => {

        try {

            setLoading(true);

            const response = await API.get("/guest/my-profile");

            const guest = response.data.guest;

            setFormData({
                name: guest.name || "",
                email: guest.email || "",
                contactNumber: guest.contactNumber || "",
                address: guest.address || "",
                preferences: Array.isArray(guest.preferences)
                    ? guest.preferences.join(", ")
                    : (guest.preferences || ""),
                profileImage: guest.profileImage || ""
            });

        } catch (error) {

            console.log("My Profile API Error:", error);

        } finally {

            setLoading(false);
        }
    };



    // ==============================
    // HANDLE INPUT
    // ==============================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // ==============================
    // HANDLE PASSWORD INPUT
    // ==============================
    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==============================
    // UPDATE PROFILE
    // ==============================
    const handleSave = async () => {

        try {

            const form = new FormData();

            form.append("name", formData.name);
            form.append("contactNumber", formData.contactNumber);
            form.append("address", formData.address);

            // preferences string => array
            const preferencesArray =
                formData.preferences
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== "");

            preferencesArray.forEach((item) => {
                form.append("preferences", item);
            });

            // image
            if (profileFile) {
                form.append("profileImage", profileFile);
            }

            const response = await API.patch(
                "/guest/update-profile",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("UPDATED:", response.data);

            setIsEditing(false);

setFormData({
    name: response.data.guest.name || "",
    email: response.data.guest.email || "",
    contactNumber: response.data.guest.contactNumber || "",
    address: response.data.guest.address || "",
    preferences: Array.isArray(response.data.guest.preferences)
        ? response.data.guest.preferences.join(", ")
        : (response.data.guest.preferences || ""),
    profileImage: response.data.guest.profileImage || ""
});
            setProfileFile(null);

        } catch (error) {

            console.log("Update Error:", error);
        }
    };

    // ==============================
    // REMOVE PROFILE IMAGE
    // ==============================
    const removeProfileImage = async () => {

        try {

            await API.delete("/guest/remove-profile-image");

            setFormData((prev) => ({
                ...prev,
                profileImage: ""
            }));

            fetchMyProfile();

        } catch (error) {

            console.log("Remove Image Error:", error);
        }
    };

    // ==============================
    // LOGOUT
    // ==============================
    const handleLogout = async () => {
        try {
            await API.post("/guest/logout"); // call backend

            localStorage.removeItem("token"); // remove JWT

            window.location.href = "/login"; // redirect
        } catch (error) {
            console.log("Logout Error:", error);

            // even if API fails, still logout locally
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    // ==============================
    // IMAGE URL
    // ==============================
    const imageSrc = formData.profileImage
        ? (
            formData.profileImage.startsWith("http") ||
            formData.profileImage.startsWith("blob:")
        )
            ? formData.profileImage
            : `http://localhost:5000${formData.profileImage}`
        : "/default-avatar.png";


    // ==============================
    // CHANGE PASSWORD
    // ==============================
    const handleChangePassword = async () => {

        try {

            if (
                !passwordData.oldPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
            ) {
                return alert("All password fields are required");
            }

            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {
                return alert("New passwords do not match");
            }

            setPasswordLoading(true);

            const response = await API.patch(
                "/guest/change-password",
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                }
            );

            alert(response.data.msg);

            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.log("Password Change Error:", error);

            alert(
                error?.response?.data?.msg ||
                "Password change failed"
            );

        } finally {

            setPasswordLoading(false);
        }
    };

    // ==============================
    // FETCH MY BOOKINGS
    // ==============================

    const fetchMyBookings = async () => {

        try {

            const response = await API.get("/booking/my-bookings");

            setBookings(response.data.bookings || []);

        } catch (error) {

            console.log("Bookings Error:", error);

        } finally {

            setBookingsLoading(false);
        }
    };

    // ==============================
    // CANCEL BOOKING
    // ==============================

    const handleCancelBooking = async (bookingId) => {

        try {

            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmCancel) return;

            const response = await API.patch(
                `/booking/cancel-my-booking/${bookingId}`
            );

            alert(response.data.msg);

            // refresh bookings
            fetchMyBookings();

        } catch (error) {

            console.log("Cancel Booking Error:", error);

            alert(
                error?.response?.data?.msg ||
                "Failed to cancel booking"
            );
        }
    };


    // ==============================
    // FETCH MY INVOICES
    // ==============================

    const fetchMyInvoices = async () => {

        try {

            setInvoicesLoading(true);

            const response = await API.get("/billing/my-invoices");

            setInvoices(response.data.invoices || []);

        } catch (error) {

            console.log("Invoices Error:", error);

        } finally {

            setInvoicesLoading(false);
        }
    };

    // ==============================
    // HANDLE PAY BILL
    // ==============================
    const handlePayBill = async (billId, amount) => {

        try {

            const confirmPay = window.confirm("Do you want to pay this bill?");
            if (!confirmPay) return;

            const response = await API.post("/billing/guest-pay", {
                billId,
                amount: Number(amount)

            });

            alert(response.data.msg);

            fetchMyInvoices();

        } catch (error) {

            console.log("Payment Error:", error);

            alert(
                error?.response?.data?.msg ||
                "Payment failed"
            );
        }
    };


    // ==============================
    // USE EFFECT
    // ==============================

    useEffect(() => {
        fetchMyProfile();
        fetchMyBookings();
        fetchMyInvoices();
    }, []);


    // ==============================
    // LOADING
    // ==============================
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }


    // ==============================
    // REPORT MAINTENANCE ISSUE
    // ==============================

    const handleReportIssue = async () => {
    try {

        if (!maintenanceData.roomId || !maintenanceData.issue) {
            return alert("Room and issue are required");
        }

        setMaintenanceLoading(true);

        const token = localStorage.getItem("token");

        const res = await API.post(
            "/maintenance/report",
            maintenanceData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.msg);

        setMaintenanceData({
            roomId: "",
            issue: ""
        });

    } catch (error) {
        console.log(error);

        alert(
            error?.response?.data?.msg ||
            "Failed to report issue"
        );

    } finally {
        setMaintenanceLoading(false);
    }
};

const uniqueRooms = bookings
    .filter(b => b?.room?._id)
    .map(b => ({
        id: b.room._id,
        number: b.room.roomNumber
    }))
    .filter((v, i, a) =>
        a.findIndex(x => x.id === v.id) === i
    );
    return (

        <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 text-sm text-gray-600">

            <div className="max-w-3xl mx-auto space-y-6">

                {/* ================= HEADER ================= */}

                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative">

                    {/* ================= TOP BUTTONS ================= */}

                    <div className="absolute top-6 right-6 flex items-center gap-3">

                        {/* LOGOUT */}

                        <button
                            onClick={handleLogout}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-100 transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                        {/* EDIT / SAVE */}

                        {isEditing ? (

                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                            >
                                Save Changes
                            </button>

                        ) : (

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
                            >
                                Edit Profile
                            </button>

                        )}
                    </div>

                    {/* ================= PROFILE IMAGE ================= */}

                    <div className="relative shrink-0">

                        {/* IMAGE CONTAINER */}

                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner">

                            <img
                                src={imageSrc}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />

                        </div>

                        {/* CAMERA BUTTON */}

                        {isEditing && (

                            <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-white transition">

                                <Camera size={18} />

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {

                                        const file = e.target.files[0];

                                        if (file) {

                                            setProfileFile(file);

                                            setFormData((prev) => ({
                                                ...prev,
                                                profileImage:
                                                    URL.createObjectURL(file)
                                            }));
                                        }
                                    }}
                                />
                            </label>
                        )}

                        {/* REMOVE IMAGE BUTTON */}

                        {isEditing && formData.profileImage && (

                            <button
                                onClick={removeProfileImage}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    {/* ================= INFO ================= */}

                    <div className="flex-1 w-full space-y-5">

                        {/* NAME */}

                        <div>

                            <span className="text-xs font-bold text-gray-400">
                                Full Name
                            </span>

                            {isEditing ? (

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                                />

                            ) : (

                                <h2 className="text-2xl font-black text-gray-900 mt-1">
                                    {formData.name}
                                </h2>

                            )}
                        </div>

                        {/* GRID */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">

                            {/* EMAIL */}

                            <div>

                                <span className="text-xs font-bold text-gray-400">
                                    Email
                                </span>

                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full mt-1 border border-gray-100 bg-gray-100 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* CONTACT */}

                            <div>

                                <span className="text-xs font-bold text-gray-400">
                                    Contact
                                </span>

                                {isEditing ? (

                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                ) : (

                                    <p className="text-gray-800 mt-1">
                                        {formData.contactNumber || "No Contact"}
                                    </p>

                                )}
                            </div>

                            {/* ADDRESS */}

                            <div className="sm:col-span-2">

                                <span className="text-xs font-bold text-gray-400">
                                    Address
                                </span>

                                {isEditing ? (

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 resize-none"
                                    />

                                ) : (

                                    <p className="text-gray-800 mt-1">
                                        {formData.address || "No Address"}
                                    </p>

                                )}
                            </div>

                            {/* PREFERENCES */}

                            <div className="sm:col-span-2">

                                <span className="text-xs font-bold text-gray-400">
                                    Preferences
                                </span>

                                {isEditing ? (

                                    <input
                                        type="text"
                                        name="preferences"
                                        value={formData.preferences}
                                        onChange={handleChange}
                                        placeholder="Spa, Sea View, Breakfast"
                                        className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                ) : (

                                    <p className="text-gray-800 mt-1">
                                        {formData.preferences?.length > 0
                                            ? formData.preferences
                                            : "No Preferences yet"}
                                    </p>

                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <br />
            {/* ================= CHANGE PASSWORD ================= */}

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6 ">

                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">

                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-1.5 0h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 19.5V12a1.5 1.5 0 011.5-1.5z"
                            />
                        </svg>

                    </div>

                    <div>

                        <h3 className="text-lg font-black text-gray-900">
                            Change Password
                        </h3>

                        <p className="text-xs text-gray-400">
                            Keep your account secure
                        </p>

                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5">

                    {/* OLD PASSWORD */}

                    <div>

                        <span className="text-xs font-bold text-gray-400">
                            Old Password
                        </span>

                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter old password"
                            className="w-full mt-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* NEW PASSWORD */}

                    <div>

                        <span className="text-xs font-bold text-gray-400">
                            New Password
                        </span>

                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="w-full mt-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                        <span className="text-xs font-bold text-gray-400">
                            Confirm New Password
                        </span>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="w-full mt-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* BUTTON */}

                    <div className="pt-2">

                        <button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100"
                        >
                            {
                                passwordLoading
                                    ? "Updating..."
                                    : "Update Password"
                            }
                        </button>
                    </div>

                </div>
            </div>

            {/* ==========================================
                DROPDOWN SECTION 1: MY BOOKINGS
                ========================================== */}

            <div className="max-w-3xl mx-auto mt-6">

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                    {/* HEADER */}

                    <button
                        onClick={() => setShowBookings(!showBookings)}
                        className="w-full flex items-center justify-between px-6 sm:px-8 py-6 hover:bg-gray-50 transition"
                    >

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">

                                <CalendarDays size={22} />

                            </div>

                            <div className="text-left">

                                <h3 className="text-lg font-black text-gray-900">
                                    My Bookings
                                </h3>

                                <p className="text-xs text-gray-400">
                                    View all your reservations
                                </p>

                            </div>
                        </div>
                        <div>


                            {
                                showBookings
                                    ? <ChevronUp size={22} className="text-gray-500" />
                                    : <ChevronDown size={22} className="text-gray-500" />
                            }

                        </div>

                    </button>

                    {/* CONTENT */}

                    {
                        showBookings && (

                            <div className="px-6 sm:px-8 pb-8">

                                {
                                    bookingsLoading ? (

                                        <div className="py-10 text-center text-gray-400">
                                            Loading bookings...
                                        </div>

                                    ) : bookings.length === 0 ? (

                                        <div className="py-10 text-center">

                                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">

                                                <BedDouble className="text-gray-400" size={34} />

                                            </div>

                                            <h4 className="text-lg font-bold text-gray-700">
                                                No Bookings Yet
                                            </h4>

                                            <p className="text-sm text-gray-400 mt-1">
                                                Your hotel bookings will appear here
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="space-y-5">

                                            {
                                                bookings.map((booking) => {

                                                    const statusColors = {
                                                        pending:
                                                            "bg-yellow-50 text-yellow-700 border-yellow-200",

                                                        confirmed:
                                                            "bg-green-50 text-green-700 border-green-200",

                                                        cancelled:
                                                            "bg-red-50 text-red-700 border-red-200",

                                                        checkin:
                                                            "bg-blue-50 text-blue-700 border-blue-200",

                                                        checkout:
                                                            "bg-gray-100 text-gray-700 border-gray-200"
                                                    };

                                                    return (

                                                        <div
                                                            key={booking._id}
                                                            className="border border-gray-100 rounded-3xl p-5 hover:shadow-md transition bg-gradient-to-br from-white to-gray-50"
                                                        >

                                                            {/* TOP */}

                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                                                {/* LEFT */}

                                                                <div className="flex items-start gap-4">

                                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">

                                                                        <BedDouble size={26} />

                                                                    </div>

                                                                    <div>

                                                                        <h4 className="text-lg font-black text-gray-900">

                                                                            {
                                                                                booking?.room?.roomNumber
                                                                                    ? `Room ${booking.room.roomNumber}`
                                                                                    : "Room Booking"
                                                                            }

                                                                        </h4>

                                                                        <p className="text-sm text-gray-500 mt-1">

                                                                            {
                                                                                booking?.room?.roomType ||
                                                                                booking?.room?.type ||
                                                                                "Luxury Room"
                                                                            }

                                                                        </p>

                                                                    </div>

                                                                </div>

                                                                {/* STATUS */}

                                                                <div
                                                                    className={`px-4 py-2 rounded-2xl border text-xs font-bold capitalize w-fit ${statusColors[booking.status] || "bg-gray-100 text-gray-700 border-gray-200"
                                                                        }`}
                                                                >
                                                                    {booking.status}
                                                                </div>
                                                                {
                                                                    ["pending", "confirmed"].includes(booking.status) && (

                                                                        <button
                                                                            onClick={() => handleCancelBooking(booking._id)}
                                                                            className="mt-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-2xl text-xs font-bold transition"
                                                                        >
                                                                            Cancel Booking
                                                                        </button>

                                                                    )
                                                                }
                                                            </div>

                                                            {/* DETAILS */}

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                                                                {/* CHECKIN */}

                                                                <div className="bg-white border border-gray-100 rounded-2xl p-4">

                                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">

                                                                        <Clock3 size={14} />

                                                                        Check In

                                                                    </div>

                                                                    <p className="mt-2 text-sm font-semibold text-gray-800">

                                                                        {
                                                                            new Date(
                                                                                booking.checkInDate
                                                                            ).toLocaleDateString()
                                                                        }

                                                                    </p>

                                                                </div>

                                                                {/* CHECKOUT */}

                                                                <div className="bg-white border border-gray-100 rounded-2xl p-4">

                                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">

                                                                        <Clock3 size={14} />

                                                                        Check Out

                                                                    </div>

                                                                    <p className="mt-2 text-sm font-semibold text-gray-800">

                                                                        {
                                                                            new Date(
                                                                                booking.checkOutDate
                                                                            ).toLocaleDateString()
                                                                        }

                                                                    </p>

                                                                </div>

                                                                {/* PRICE */}

                                                                <div className="bg-white border border-gray-100 rounded-2xl p-4">

                                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">

                                                                        <BadgeCheck size={14} />

                                                                        Total Price

                                                                    </div>

                                                                    <p className="mt-2 text-lg font-black text-indigo-600">

                                                                        Rs. {booking.totalPrice}

                                                                    </p>

                                                                </div>

                                                            </div>

                                                            {/* SERVICES */}

                                                            {booking?.services?.length > 0 && (
                                                                <div className="mt-5">

                                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                                                                        Added Services
                                                                    </p>

                                                                    <div className="flex flex-wrap gap-3">

                                                                        {booking.services.map((item, index) => (

                                                                            <div
                                                                                key={index}
                                                                                className="px-4 py-3 rounded-2xl bg-indigo-50 border border-indigo-100"
                                                                            >

                                                                                <p className="text-xs font-bold text-indigo-800">
                                                                                    {item?.serviceId?.name}
                                                                                </p>

                                                                                <p className="text-xs text-black mt-1">
                                                                                    Rs. {item?.price}
                                                                                </p>

                                                                            </div>

                                                                        ))}

                                                                    </div>

                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            }

                                        </div>
                                    )
                                }

                            </div>
                        )
                    }

                </div>

            </div>

            {/* ==========================================
                DROPDOWN SECTION 2: INVOICES
                ========================================== */}

            <div className="max-w-3xl mx-auto mt-6">

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                    {/* HEADER */}
                    <button
                        onClick={() => setShowInvoices(!showInvoices)}
                        className="w-full flex items-center justify-between px-6 sm:px-8 py-6 hover:bg-gray-50 transition"
                    >

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                <FileText size={22} />
                            </div>

                            <div className="text-left">
                                <h3 className="text-lg font-black text-gray-900">
                                    My Invoices
                                </h3>
                                <p className="text-xs text-gray-400">
                                    View all your bills & payments
                                </p>
                            </div>

                        </div>

                        <div>
                            {showInvoices
                                ? <ChevronUp size={22} className="text-gray-500" />
                                : <ChevronDown size={22} className="text-gray-500" />
                            }
                        </div>

                    </button>

                    {/* CONTENT */}
                    {showInvoices && (
                        <div className="px-6 sm:px-8 pb-8">

                            {invoicesLoading ? (

                                <p className="py-10 text-center text-gray-400">
                                    Loading invoices...
                                </p>

                            ) : invoices.length === 0 ? (

                                <p className="py-10 text-center text-gray-400">
                                    No invoices found
                                </p>

                            ) : (

                                <div className="space-y-5">

                                    {invoices.map((inv) => {

                                        const isPaid = inv.paymentStatus === "paid";

                                        return (
                                            <div
                                                key={inv._id}
                                                className="border border-gray-100 rounded-3xl p-5 bg-gradient-to-br from-white to-gray-50"
                                            >

                                                {/* TOP */}
                                                <div className="flex justify-between items-start">

                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {inv.invoiceNumber}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {new Date(inv.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <span className={`px-3 py-1 text-xs font-bold rounded-xl
                                            ${isPaid
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-red-50 text-red-600"
                                                        }`}
                                                    >
                                                        {inv.paymentStatus}
                                                    </span>

                                                </div>

                                                {/* AMOUNTS */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">

                                                    <div>
                                                        <p className="text-gray-400">Room</p>
                                                        <p className="font-bold">Rs {inv.roomCharges}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-400">Services</p>
                                                        <p className="font-bold">Rs {inv.serviceCharges}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-400">Tax</p>
                                                        <p className="font-bold">Rs {inv.taxAmount}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-400">Total</p>
                                                        <p className="font-black text-green-600">
                                                            Rs {inv.totalAmount}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* PAY BUTTON */}
                                                {!isPaid && (
                                                    <div className="mt-4 flex justify-end">

                                                        <button
                                                            onClick={() => handlePayBill(inv._id, inv.totalAmount)}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition"
                                                        >
                                                            Pay Now
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>

                            )}

                        </div>
                    )}

                </div>

            </div>


            {/* ==========================================
    REPORT MAINTENANCE ISSUE
========================================== */}

<div className="max-w-3xl mx-auto mt-6">

    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100">

            <h3 className="text-lg font-black text-gray-900">
                Report Maintenance Issue
            </h3>

            <p className="text-xs text-gray-400 mt-1">
                Report any room related problem
            </p>

        </div>

        {/* FORM */}
        <div className="px-6 sm:px-8 py-6 space-y-5">

            {/* ROOM DROPDOWN */}
            <div>
                <label className="text-xs font-bold text-gray-400">
                    Select Room
                </label>

                <select
                    value={maintenanceData.roomId}
                    onChange={(e) =>
                        setMaintenanceData({
                            ...maintenanceData,
                            roomId: e.target.value
                        })
                    }
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                >
                    <option value="">
                        Select Room Number
                    </option>

                    {uniqueRooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            Room {room.number}
                        </option>
                    ))}
                </select>
            </div>

            {/* ISSUE INPUT */}
            <div>
                <label className="text-xs font-bold text-gray-400">
                    Issue Description
                </label>

                <textarea
                    rows={4}
                    value={maintenanceData.issue}
                    onChange={(e) =>
                        setMaintenanceData({
                            ...maintenanceData,
                            issue: e.target.value
                        })
                    }
                    placeholder="Describe the issue (AC not working, water leakage, etc.)"
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 resize-none"
                />
            </div>

            {/* SUBMIT */}
            <button
                onClick={handleReportIssue}
                disabled={maintenanceLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition"
            >
                {maintenanceLoading ? "Submitting..." : "Submit Issue"}
            </button>

        </div>

    </div>

</div>
        </div>
    );
};

export default Profile;