import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import { Camera } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const ReceptionistProfile = () => {

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
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

      let imageUrl = DEFAULT_AVATAR;

      if (staff.profileImage) {

        if (staff.profileImage.startsWith("http")) {

          imageUrl = staff.profileImage;

        } else {

          imageUrl = `${BASE_URL}${staff.profileImage}`;
        }
      }

      setProfile({
        fullName: staff.name || "",
        email: staff.email || "",
        phone: staff.contactNumber || "",
        address: staff.address || "",
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

      formData.append(
        "address",
        profile.address
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

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">

        <h1 className="text-3xl font-black text-slate-900">
          Receptionist{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
            Profile
          </span>
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage your receptionist account information and profile settings.
        </p>

      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">

            {/* PROFILE IMAGE */}
            <div className="relative w-28 h-28 mx-auto mb-4">

              <div className="w-full h-full rounded-full overflow-hidden border border-slate-200 bg-slate-100">

                {profile.profileImage ? (

                  <img
                    src={profile.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                    {profile.fullName
                      ?.split(" ")
                      .map(n => n[0])
                      .join("")}
                  </div>

                )}

              </div>

              {/* CAMERA BUTTON */}
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
                      profileImage:
                        URL.createObjectURL(file)
                    });
                  }
                }}
              />

            </div>

            {/* DELETE IMAGE */}
            <button
              type="button"
              onClick={handleDeleteImage}
              className="text-xs font-bold text-red-500 hover:text-red-700 mb-3 cursor-pointer"
            >
              Remove Photo
            </button>

            <h2 className="text-lg font-black text-slate-900">
              {profile.fullName}
            </h2>

            <span className="inline-block mt-2 px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider bg-indigo-50 text-[rgb(94,74,247)] border border-indigo-100">
              {profile.role}
            </span>

            <p className="text-xs text-slate-400 mt-4">
              Joined {profile.joinedDate}
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">

          <form
            onSubmit={handleProfileUpdate}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >

            <div className="p-6 space-y-6">

              <h3 className="text-xs font-black uppercase tracking-wider text-[rgb(94,74,247)] border-b border-slate-100 pb-2">
                Receptionist Information
              </h3>

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        fullName: e.target.value
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-indigo-100 focus:border-[rgb(94,74,247)] text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500"
                  />
                </div>

              </div>

              {/* PHONE + ROLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
                    Contact Number
                  </label>

                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-indigo-100 focus:border-[rgb(94,74,247)] text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
                    Role
                  </label>

                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold capitalize text-slate-600"
                  />
                </div>

              </div>

              {/* ADDRESS */}
              <div>

                <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
                  Address
                </label>

                <textarea
                  rows="4"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-indigo-100 focus:border-[rgb(94,74,247)] text-sm font-medium resize-none"
                />

              </div>

            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">

              <div>

                {saveSuccess && (

                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                    Profile Updated Successfully!
                  </span>

                )}

              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[rgb(94,74,247)] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >

                {isSaving ? (

                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </>

                ) : (

                  "Update Profile"

                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ReceptionistProfile;