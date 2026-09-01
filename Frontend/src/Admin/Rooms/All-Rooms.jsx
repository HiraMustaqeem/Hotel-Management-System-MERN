import React, { useEffect, useState } from "react";
import API from "../../api/axios";

// =========================================================================
// 🖼️ ROOM CARD SUB-COMPONENT (NO UI CHANGE)
// =========================================================================
const RoomCard = ({ room, onDelete, onEdit }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextSlide = (e) => {
    e.stopPropagation();
    if (room.images.length <= 1) return;

    setCurrentImgIndex((prev) =>
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (room.images.length <= 1) return;

    setCurrentImgIndex((prev) =>
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  const getStatusStyles = (status) => {

    const normalizedStatus = status
      ?.trim()
      ?.toLowerCase();

    switch (normalizedStatus) {

      case "available":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "occupied":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "maintenance":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "cleaning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.08)] flex flex-col group hover:shadow-[0_10px_30px_-6px_rgba(148,163,184,0.16)] transition-all duration-300">

      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={room.images[currentImgIndex]}
          alt={`${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {room.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-4 h-4 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-4 h-4 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        <span className="absolute top-3 left-3 px-3 py-1 bg-[rgb(94,74,247)] text-white text-[10px] font-black rounded-lg">
          {room.roomType}
        </span>

        <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getStatusStyles(room.status)}`}>
          {room.status}
        </span>
      </div>

      {/* CONTENT (UNCHANGED UI) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

        <div className="flex justify-between">
          <h2 className="text-lg font-black">ROOM #{room.roomNumber}</h2>
          <div className="text-right">
            <span className="text-xs">Per Night</span> <br />
            <span className="text-base font-bold text-emerald-600">
              Rs. {Number(room.price).toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-3">
          {room.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 py-2 text-xs font-bold bg-slate-50 rounded-xl"
          >
            Edit Config
          </button>

          <button
            onClick={() => onDelete(room.id)}
            className="py-2 px-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 🚀 MAIN COMPONENT (FIXED API + NO UI CHANGE)
// =========================================================================
const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    capacity: "",
    status: "",
    description: "",
    images: [],
    newImages: []
  });


  // ✅ API FETCH FIX
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/room/all-rooms");

        const formatted = res.data.rooms.map((room) => {
          let images = room.roomImages || [];

          // string → array fix
          if (typeof images === "string") {
            images = [images];
          }

          // BASE URL ADD (IMPORTANT FIX)
          const BASE_URL = "http://localhost:5000"; // apna backend URL

          images = images.map((img) =>
            img.startsWith("http") ? img : `${BASE_URL}${img}`
          );

          // fallback image
          if (!Array.isArray(images) || images.length === 0) {
            images = [
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
            ];
          }

          return {
            id: room._id,
            roomNumber: room.roomNumber,
            roomType: room.roomType?.toLowerCase().includes("single")
              ? "single"
              : room.roomType?.toLowerCase().includes("double")
                ? "double"
                : room.roomType?.toLowerCase().includes("suite")
                  ? "suite"
                  : room.roomType?.toLowerCase().includes("deluxe")
                    ? "deluxe"
                    : room.roomType,
            price: room.price,
            capacity: room.capacity,
            status: room.status || "available",
            description: room.description,
            images,
          };
        });

        setRooms(formatted);
      } catch (error) {
        console.log("API Error:", error.message);
      }
    };

    fetchRooms();
  }, []);

  const openEditModal = (room) => {
    console.log("EDIT CLICKED:", room);

    setEditRoom(room);

    setFormData({
      roomNumber: room.roomNumber,
     roomType: room.roomType?.toLowerCase(),
      price: room.price,
      capacity: room.capacity,
      status: room.status,
      description: room.description,
      images: room.images,
      newImages: []
    });
  };

  const handleUpdateRoom = async () => {
    try {
      const form = new FormData();

      form.append("roomNumber", formData.roomNumber);
form.append("roomType", formData.roomType);
      form.append("price", formData.price);
      form.append("capacity", formData.capacity);
      form.append("status", formData.status);
      form.append("description", formData.description);

      // NEW IMAGES
      if (formData.newImages?.length > 0) {
        for (let i = 0; i < formData.newImages.length; i++) {
          form.append("roomImages", formData.newImages[i]);
        }
      }

      const res = await API.patch(
        `/room/update-room/${editRoom.id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const updatedRoom = res.data.room;

      const BASE_URL = "http://localhost:5000";

      const updatedImages = updatedRoom.roomImages.map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}${img}`
      );

      setRooms((prev) =>
        prev.map((r) =>
          r.id === editRoom.id
            ? {
              ...r,
              roomNumber: updatedRoom.roomNumber,
roomType: updatedRoom.roomType?.toLowerCase(),
              price: updatedRoom.price,
              capacity: updatedRoom.capacity,
              status: updatedRoom.status,
              description: updatedRoom.description,
              images: updatedImages
            }
            : r
        )
      );

      setEditRoom(null);

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  // ✅ DELETE FIX (API + UI sync)
  const handleDeleteRoom = async (roomId) => {
    const ok = window.confirm("Delete room?");
    if (!ok) return;

    try {
      await API.delete(`/room/delete-room/${roomId}`);

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.log("Delete Error:", err.message);
    }
  };

  useEffect(() => {
    if (editRoom) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editRoom]);

  const getStatusStyles = (status) => {

    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {

      case "available":
        return `
      bg-emerald-50
      text-emerald-700
      border-emerald-200
      `;

      case "occupied":
        return `
      bg-blue-50
      text-blue-700
      border-blue-200
      `;

      case "maintenance":
        return `
      bg-orange-50
      text-orange-700
      border-orange-200
      `;

      case "cleaning":
        return `
      bg-yellow-50
      text-yellow-700
      border-yellow-200
      `;

      default:
        return `
      bg-slate-100
      text-slate-700
      border-slate-200
      `;
    }
  };
  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800">

      <div className="max-w-7xl mx-auto flex justify-between mb-8">
        <h1 className="text-2xl font-black">Active Room Inventory</h1>
        <div className="bg-slate-900 text-white px-4 py-1 rounded-xl">
          Total Rooms: {rooms.length}
        </div>
      </div>

      {rooms.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onDelete={handleDeleteRoom} onEdit={openEditModal} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-slate-500">
          No rooms available
        </div>
      )}
      {editRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020617]/70 backdrop-blur-md">

          <div className="min-h-screen flex items-center justify-center p-4">

            <div
              className="
  relative w-full max-w-6xl
my-10
  rounded-[36px]
  bg-[#f8fafc]
  border border-white/20
  shadow-[0_40px_120px_-20px_rgba(15,23,42,0.45)]
  flex flex-col
"
            >

              {/* HEADER */}
              {/* PREMIUM HEADER */}
              <div
                className="
  relative overflow-hidden
  px-10 py-8
  bg-gradient-to-br from-[#312e81] via-[#4338ca] to-[#7c3aed]
  border-b border-white/10
  shrink-0

  rounded-t-[36px]
"
              >

                {/* background glow */}
                <div className="absolute -top-24 -right-16 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl" />

                {/* decorative grid */}
                <div
                  className="
    absolute inset-0 opacity-[0.06]
    [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
    [background-size:32px_32px]
  "
                />

                <div className="relative flex items-center justify-between">

                  {/* LEFT CONTENT */}
                  <div className="flex items-center gap-5">

                    {/* ICON */}
                    <div
                      className="
        w-16 h-16 rounded-[22px]
        bg-white/10
        backdrop-blur-xl
        border border-white/10
        flex items-center justify-center
        shadow-[0_10px_30px_rgba(0,0,0,0.18)]
      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7A2 2 0 015 5H19A2 2 0 0121 7V17A2 2 0 0119 19H5A2 2 0 013 17V7Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11H17"
                        />
                      </svg>
                    </div>

                    {/* TEXT */}
                    <div>

                      <div className="flex items-center gap-3">

                        <h2 className="text-[32px] leading-none font-black tracking-tight text-white">
                          Edit Room
                        </h2>

                        <span
                          className="
  px-3 py-1 rounded-full
  bg-white/10
  border border-white/10
  text-[11px] font-bold tracking-wide
  text-indigo-100 uppercase
"
                        >
                          {formData.roomType === "single"
                            ? "Single Room"
                            : formData.roomType === "double"
                              ? "Double Room"
                              : formData.roomType === "suite"
                                ? "Suite Room"
                                : formData.roomType === "deluxe"
                                  ? "Deluxe Room"
                                  : formData.roomType}
                        </span>

                      </div>

                      <p className="text-indigo-100/90 mt-2 text-sm font-medium">
                        Manage room details, pricing, status & media gallery
                      </p>

                    </div>

                  </div>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => setEditRoom(null)}
                    className="
      group
      relative
      w-12 h-12 rounded-2xl
      bg-white/10
      backdrop-blur-xl
      border border-white/10
      hover:bg-white/20
      hover:rotate-90
      transition-all duration-300
      flex items-center justify-center
      shadow-lg
    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                </div>
              </div>

              {/* SCROLL BODY */}
              <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8">

                {/* ROOM DETAILS */}
                <div className="bg-white rounded-[30px] border border-slate-200 p-7 shadow-sm h-fit">

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        Room Details
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Configure pricing, availability and occupancy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ROOM NUMBER */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">
                        Room Number
                      </label>

                      <input
                        value={formData.roomNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roomNumber: e.target.value
                          })
                        }
                        className="
                w-full h-14 px-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                outline-none
                text-sm font-semibold
                transition-all duration-200

                focus:bg-white
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
                      />
                    </div>

                    {/* ROOM TYPE */}
<div>
  <label className="text-sm font-bold text-slate-700 block mb-2">
    Room Type
  </label>

  <select
    value={formData.roomType}
    onChange={(e) =>
      setFormData({
        ...formData,
        roomType: e.target.value
      })
    }
    className="
      w-full h-14 px-5
      rounded-2xl
      bg-slate-50
      border border-slate-200
      outline-none
      text-sm font-semibold
      transition-all duration-200

      focus:bg-white
      focus:border-indigo-500
      focus:ring-4
      focus:ring-indigo-500/10
    "
  >
    <option value="single">Single Room</option>
    <option value="double">Double Room</option>
    <option value="suite">Suite Room</option>
    <option value="deluxe">Deluxe Room</option>
  </select>
</div>

                    {/* PRICE */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">
                        Price
                      </label>

                      <input
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: e.target.value
                          })
                        }
                        className="
                w-full h-14 px-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                outline-none
                text-sm font-semibold
                transition-all duration-200

                focus:bg-white
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
                      />
                    </div>

                    {/* CAPACITY */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">
                        Capacity
                      </label>

                      <input
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacity: e.target.value
                          })
                        }
                        className="
                w-full h-14 px-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                outline-none
                text-sm font-semibold
                transition-all duration-200

                focus:bg-white
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
                      />
                    </div>

                    {/* STATUS */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">
                        Status
                      </label>

                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value
                          })
                        }
                        className="
                w-full h-14 px-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                outline-none
                text-sm font-semibold
                transition-all duration-200

                focus:bg-white
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-6">
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      Description
                    </label>

                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                      className="
              w-full p-5
              rounded-2xl
              bg-slate-50
              border border-slate-200
              outline-none
              resize-none
              text-sm font-medium
              transition-all duration-200

              focus:bg-white
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-500/10
            "
                    />
                  </div>

                </div>

                {/* EXISTING IMAGES */}
                <div className="bg-white rounded-[30px] border border-slate-200 p-7 shadow-sm">

                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        Existing Images
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Hover over image to remove
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 items-start">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="
relative group overflow-hiddenw-[220px] flex-shrink-0w-fit
rounded-[26px]
border border-slate-200
bg-white
shadow-sm
hover:shadow-2xl
hover:-translate-y-1
transition-all duration-300
"
                      >

                        <img
                          src={img}
                          className="w-full h-44 object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        <button
                          onClick={async () => {
                            try {
                              const imageName = img.split("/").pop();

                              await API.delete(
                                `/room/delete-room-image/${editRoom.id}/${imageName}`
                              );

                              setFormData({
                                ...formData,
                                images: formData.images.filter((i) => i !== img)
                              });

                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="
                  absolute inset-0
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                "
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl">

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7L5 7M10 11V17M14 11V17M6 7L7 19C7.1 20 7.9 21 9 21H15C16.1 21 16.9 20 17 19L18 7"
                              />
                            </svg>

                          </div>
                        </button>

                      </div>
                    ))}

                  </div>
                </div>

                {/* UPLOAD SECTION */}
                <div className="bg-white rounded-[30px] border border-slate-200 p-7 shadow-sm inline-block w-full">
                  <div className="mb-5">
                    <h3 className="text-xl font-black text-slate-800">
                      Upload New Images
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      High quality room gallery management
                    </p>
                  </div>

                  <label
                    className="
            h-64 rounded-[32px]
            border-2 border-dashed border-indigo-300
            bg-gradient-to-br from-indigo-50 to-violet-50
            flex flex-col items-center justify-center
            cursor-pointer
            hover:border-indigo-500
            hover:scale-[1.01]
            transition-all duration-300
          "
                  >

                    <div className="w-24 h-24 rounded-[30px] bg-white shadow-lg flex items-center justify-center mb-5">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7A2 2 0 015 5H8L10 3H14L16 5H19A2 2 0 0121 7V18A2 2 0 0119 20H5A2 2 0 013 18V7Z"
                        />
                      </svg>

                    </div>

                    <p className="text-lg font-bold text-slate-700">
                      Upload Room Images
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      PNG, JPG • Max 5 files
                    </p>

                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newImages: [...e.target.files]
                        })
                      }
                    />
                  </label>

                </div>

              </div>

              {/* NEW IMAGE PREVIEW */}
              {formData.newImages?.length > 0 && (
                <div className="bg-white rounded-[30px] border border-slate-200 p-7 shadow-sm">

                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        Selected Images
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Preview before upload
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-bold">
                      {formData.newImages.length} Files
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-5">
                    {[...formData.newImages].map((file, index) => (
                      <div
                        key={index}
                        className="
          relative group overflow-hidden
          rounded-[26px]
          border border-slate-200
          bg-white
          shadow-sm
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all duration-300
        "
                      >

                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-[220px] h-[160px] object-cover" />

                        {/* dark overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        {/* remove btn */}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFiles = [...formData.newImages];
                            updatedFiles.splice(index, 1);

                            setFormData({
                              ...formData,
                              newImages: updatedFiles
                            });
                          }}
                          className="
            absolute top-3 right-3
            w-10 h-10 rounded-2xl
            bg-white text-red-500
            shadow-xl
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-all duration-300
          "
                        >
                          ✕
                        </button>

                        {/* bottom label */}
                        <div className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/80 to-transparent
          p-4
          ">

                          <p className="text-white text-sm font-semibold truncate">
                            {file.name}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

              {/* FOOTER */}
              <div
                className="
        shrink-0
        px-8 py-5
        border-t border-slate-200
        bg-white
        flex items-center justify-end gap-4
      "
              >

                <button
                  onClick={() => setEditRoom(null)}
                  className="
          h-12 px-7 rounded-2xl
          bg-slate-100
          hover:bg-slate-200
          text-slate-700
          font-bold
          transition-all duration-200
        "
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateRoom}
                  className="
          h-12 px-8 rounded-2xl
          bg-gradient-to-r from-indigo-600 to-violet-600
          text-white font-bold
          shadow-lg shadow-indigo-500/25
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all duration-200
        "
                >
                  Save Changes
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllRooms;

