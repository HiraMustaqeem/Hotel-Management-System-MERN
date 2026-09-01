import React, { useState } from 'react';
import API from "../../api/axios"; // adjust path if needed
const AddRooms = () => {
  // Local Form State
 const [formData, setFormData] = useState({
  roomNumber: '',
  roomType: 'single',   // ✅ FIXED
  price: '',
  capacity: 2,          // ✅ FIXED NUMBER
  description: '',
});

  const [imagePreview, setImagePreview] = useState([]);
  const [images, setImages] = useState([]);

  // Handle Inputs Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dummy Image Selection Handler (UI Purpose Only)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const totalImages = images.length + files.length;

    if (totalImages > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    // store real files for backend
    setImages(prev => [...prev, ...files]);

    // preview only UI purpose
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...previewUrls]);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("roomNumber", formData.roomNumber);
      form.append("roomType", formData.roomType);
form.append("price", Number(formData.price));
form.append("capacity", parseInt(formData.capacity));
      form.append("description", formData.description);

      // append images (VERY IMPORTANT KEY NAME: roomImages)
      images.forEach((file) => {
        form.append("roomImages", file);
      });

      const res = await API.post("/room/create-room", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Room Created:", res.data);
      alert("Room created successfully!");

      // reset form
      setFormData({
        roomNumber: "",
        roomType: "single",
        price: "",
        capacity: "2",
        description: "",
      });

      setImages([]);
      setImagePreview([]);

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Error creating room");
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased selection:bg-[rgb(94,74,247)] selection:text-white">

      {/* 👑 Admin Page Header Section */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Add New <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Room Slot</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create new inventory listings by assigning room configurations, price values, and digital media assets.
          </p>
        </div>
      </div>

      {/* 🚀 Main Form Card Container */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] border border-slate-100 p-6 md:p-8 space-y-6">

          {/* Form Core Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Field 1: Room Number */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Room Number / Identifier
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g., Room-302, Suite-104"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-indigo-50/50 transition-all"
              />
            </div>

            {/* Field 2: Room Type (Updated with your 4 classifications & Dropdown Icon) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Room Classification Type
              </label>
              <div className="relative">
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-10 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm bg-white focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-indigo-50/50 transition-all appearance-none cursor-pointer"
                >
  <option value="single">Single Room</option>
  <option value="double">Double Room</option>
  <option value="suite">Suite Room</option>
  <option value="deluxe">Deluxe Room</option>
                </select>
                {/* Custom SVG Dropdown Icon */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Field 3: Price per Night */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Price Rate (Per Night / Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-400 select-none">Rs.</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="45,000"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-indigo-50/50 transition-all"
                />
              </div>
            </div>

            {/* Field 4: Capacity (Updated with Dropdown Icon) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Max Capacity Allowance
              </label>
              <div className="relative">
                <select
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-10 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm bg-white focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-indigo-50/50 transition-all appearance-none cursor-pointer"
                >
                    <option value={1}>1 Person</option>
  <option value={2}>2 Persons</option>
  <option value={3}>3 Persons</option>
  <option value={4}>4 Persons</option>
                </select>
                {/* Custom SVG Dropdown Icon */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Field 5: Room Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Room Description & Amenities Overview
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe room amenities, view specifications, bed layout variants, and premium high-tier offerings..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-indigo-50/50 transition-all resize-none"
            />
          </div>

          {/* Field 6: Room Images Upload Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Media Assets (Room Showcase Images)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Custom File Upload Box */}
              <div className="md:col-span-1 h-52 relative border-2 border-dashed border-slate-200 hover:border-[rgb(94,74,247)] rounded-xl p-6 transition-colors group cursor-pointer flex flex-col items-center justify-center text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <svg className="w-8 h-8 text-slate-300 group-hover:text-[rgb(94,74,247)] transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold text-slate-700">Click to upload digital media asset</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG up to 5MB</span>
              </div>

              {/* Real-time Dynamic UI Preview Slot */}
              <div className="w-full md:col-span-2 min-h-52 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden relative p-2">

                {imagePreview.length > 0 ? (

                  <div className="grid grid-cols-2 gap-2 w-full">
                    {imagePreview.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Preview ${index}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Image Asset Preview
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors border border-transparent"
            >
              Reset Data
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-100 transition-all"
            >
              Publish Room Listing
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddRooms;