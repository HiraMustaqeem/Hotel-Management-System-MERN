import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminContact() {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ======================================================
    // FETCH CONTACTS
    // ======================================================

    const fetchContacts = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/contact/all"
            );

            setContacts(
                response.data.contacts || []
            );

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.msg ||
                "Failed to load contacts"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchContacts();

    }, []);

    // ======================================================
    // DELETE CONTACT
    // ======================================================

    const handleDeleteContact = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {

            const response = await API.delete(
                `/contact/delete/${id}`
            );

            setContacts((prev) =>
                prev.filter(
                    (item) => item._id !== id
                )
            );

            alert(response.data.msg);

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.msg ||
                "Failed to delete message"
            );
        }
    };

    return (

        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-800">

            {/* HEADER */}

            <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-200/70">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">

                            Contact Message{" "}

                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">

                                Management

                            </span>

                        </h1>

                        <p className="text-sm text-slate-500 mt-1">

                            Monitor and manage all guest contact inquiries submitted through the platform.

                        </p>

                    </div>

                    <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">

                        Total Messages: {contacts.length}

                    </div>

                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div className="min-h-screen flex items-center justify-center bg-white">

                    <div className="flex flex-col items-center gap-3">

                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[rgb(94,74,247)] rounded-full animate-spin"></div>

                    </div>

                </div>

            ) : contacts.length === 0 ? (

                <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-slate-100 rounded-3xl shadow-sm mt-12">

                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">

                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l9 6 9-6m-18 8h18V8l-9 6-9-6v8z"
                            />
                        </svg>

                    </div>

                    <h3 className="text-base font-black text-slate-900">

                        No Messages Found

                    </h3>

                    <p className="text-xs text-slate-500 mt-1">

                        Guest contact messages will appear here.

                    </p>

                </div>

            ) : (

<div className="max-w-7xl mx-auto space-y-4">

    {contacts.map((item) => (

        <div
            key={item._id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
        >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* LEFT */}

                <div className="flex items-start gap-4 flex-1">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-black text-lg shrink-0">

                        {(item?.guest?.name || "G")
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-base font-black text-slate-900">

                                {item?.guest?.name || "Guest User"}

                            </h3>

                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">

                                New Inquiry

                            </span>

                        </div>

                        <p className="text-xs text-slate-400 mt-1 break-all">

                            {item?.guest?.email || "No Email"}

                        </p>

                        <div className="mt-3">

                            <h4 className="text-sm font-bold text-indigo-600">

                                {item.subject}

                            </h4>

                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">

                                {item.message}

                            </p>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4">

                    <div className="text-right">

                        <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">

                            Received
                        </p>

                        <p className="text-sm font-semibold text-slate-700">

                            {new Date(
                                item.createdAt
                            ).toLocaleDateString()}
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            handleDeleteContact(item._id)
                        }
                        className="w-11 h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-all group"
                    >

                        <svg
                            className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7L18.132 19.142A2 2 0 0116.138 21H7.862A2 2 0 015.868 19.142L5 7M10 11V17M14 11V17M4 7H20M15 7V4A1 1 0 0014 3H10A1 1 0 009 4V7"
                            />
                        </svg>

                    </button>

                </div>

            </div>

        </div>

    ))}

</div>
            )}

        </div>
    );
}

export default AdminContact;