import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import { Camera } from "lucide-react";

const BASE_URL = "http://localhost:5000";
const AdminProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // 1. Personal Info State with Dynamic Role Controller
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    joinedDate: "",
    profileImage: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/staff/my-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const staff = res.data.staff;

      const DEFAULT_AVATAR =
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

      // OPTION A IMAGE HANDLING
      let imageUrl = DEFAULT_AVATAR;

      if (staff.profileImage) {

        // agar DB me already full URL hai
        if (
          staff.profileImage.startsWith("http")
        ) {

          imageUrl = staff.profileImage;

        } else {

          // agar relative path hai
          imageUrl =
            `${BASE_URL}${staff.profileImage}`;
        }
      }

      setProfile({
        fullName: staff.name || "",
        email: staff.email || "",
        phone: staff.contactNumber || "",
        role: staff.role || "",
        joinedDate: new Date(
          staff.createdAt
        ).toLocaleDateString(),

        profileImage: imageUrl
      });

    } catch (error) {

      console.log(error);

    }
  };


  // Role Matrix configuration to show permissions on screen dynamically
  const rolePermissionsMatrix = {
    "Super Admin": {
      description: "Full system execution node access. Can override billing architecture, manage system keys, and delete root logs.",
      badges: ["All Operations", "Database Access", "API Mutation", "Financial Write"]
    },
    "Manager": {
      description: "Operational node controller. Can approve bookings, update logs, and manage feedback, but cannot mutate core API settings.",
      badges: ["Booking Management", "Feedback Resolve", "Log Read"]
    },
    "Editor / Staff": {
      description: "Read-heavy assistance node. Can respond to customer reports and maintain profiles, but restricted from financial matrix tracking.",
      badges: ["Profile Edit", "Report View", "Support Resolve"]
    }
  };



  const handleProfileUpdate = async (e) => {

    e.preventDefault();

    setIsSaving(true);
    setSaveSuccess(false);

    try {

      const token =
        localStorage.getItem("token");

      const formData = new FormData();

      formData.append(
        "name",
        profile.fullName
      );

      formData.append(
        "contactNumber",
        profile.phone
      );

      if (selectedImage) {

        formData.append(
          "profileImage",
          selectedImage
        );
      }

      await API.patch(
        "/staff/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      await fetchProfile();

      setSaveSuccess(true);

      setTimeout(() => {

        setSaveSuccess(false);

      }, 3000);

    } catch (error) {

      console.log(error);

    } finally {

      setIsSaving(false);
    }
  };

  const handleDeleteImage = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await API.delete(
        "/staff/delete-profile-image",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProfile();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased">

      {/* Header Panel */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
          Account <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Profile</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal identity credentials, system enforcement roles, and active server login sessions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: AVATAR CARD & ACTIVE SESSIONS */}
        <div className="lg:col-span-1 space-y-6">

          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-[0_4px_20px_-4px_rgba(148,163,184,0.04)]">

            <div className="relative w-24 h-24 mx-auto mb-4 group">

              <div className="w-full h-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">

                {profile.profileImage ? (

                  <img
                    src={profile.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                    {profile.fullName
                      ?.split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>

                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("profileImageInput").click()
                }
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[rgb(94,74,247)] text-white border-4 border-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition"
              >
                <Camera className="w-5 h-5" />
              </button>

              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {

                  const file = e.target.files[0];

                  if (file) {

                    setSelectedImage(file);

                    setProfile({
                      ...profile,
                      profileImage: URL.createObjectURL(file)
                    });
                  }
                }}
              />

            </div>

            {/* DELETE BUTTON HERE */}
            <button
              type="button"
              onClick={handleDeleteImage}
              className="mb-3 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
            >
              Remove Photo
            </button>

            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {profile.fullName}
            </h3>

            <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[rgb(94,74,247)] bg-indigo-50 border border-indigo-100/50 rounded-md">
              {profile.role}
            </span>

            <p className="text-[11px] text-slate-400 mt-3 font-medium">
              Member since {profile.joinedDate}
            </p>

          </div>
        </div>

        {/* RIGHT COLUMN: CORE INTERACTIVE CONFIGURATIONS */}
        <div className="lg:col-span-2">
          <form onSubmit={handleProfileUpdate} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.04)] overflow-hidden">

            <div className="p-6 sm:p-8 space-y-6">

              {/* SECTION 1: Identity & Roles */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[rgb(94,74,247)] border-b border-slate-100 pb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Full Legal Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Account Email (Login Node)</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Contact Verification Number</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all font-medium"
                    />
                  </div>

                  {/*  PREMIUM DYNAMIC ROLE SELECTION PANEL */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">System Access Role</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-600 capitalize"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer Status Bar */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <div>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Profile Parameters Restructured!
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(94,74,247)] hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Syncing Node...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default AdminProfile;              