import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddBookings = ({ setActivePage, setSelectedRoom }) => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const response = await API.get("/room/see-all-rooms", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRooms(response.data.rooms || []);
            } catch (error) {
                console.log("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <section className="py-8 px-6 md:px-8 lg:px-4 bg-slate-50/50">

            {/* HEADER */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-4xl font-bold  text-indigo-600 tracking-tight">Available Rooms Catalog</h1>
                <p className="text-sm text-black-500 mt-1.5 ">Select an active empty suite space to initialize direct frontline client booking.</p>
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="text-center text-gray-400">Loading rooms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8 mt-1">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            setActivePage={setActivePage}
                            setSelectedRoom={setSelectedRoom}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

const RoomCard = ({ room, setActivePage, setSelectedRoom }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500"
        >
            {/* TOOLTIP */}
            <span
                className="absolute px-3 py-1.5 z-20 text-[10px] rounded-lg bg-black/80 text-white font-bold pointer-events-none uppercase tracking-widest"
                style={{
                    top: position.y + 15,
                    left: position.x + 15,
                    opacity: tooltipVisible ? 1 : 0,
                    transform: tooltipVisible ? "scale(1)" : "scale(0.8)",
                    transition: "all 0.1s ease-out",
                }}
            >
                {room.status}
            </span>

            {/* IMAGE */}
            <div className="relative h-72 overflow-hidden">
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    src={`http://localhost:5000${room.roomImages?.[0]}`}
                    alt={room.roomType}
                />

                <div className="absolute top-5 left-5">
                    <span className="bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-xs font-black">
                        #{room.roomNumber}
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">
                    {room.roomType}
                </h3>

                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-black text-indigo-600">
                        PKR {room.price}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">
                        / per night
                    </span>
                </div>

                <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                    {room.description}
                </p>

                <div className="flex justify-between items-center mt-6 text-xs font-bold">
                    <span>{room.capacity} Guests</span>

                    <span
                        className={`uppercase ${room.status === "available"
                            ? "text-green-500"
                            : room.status === "cleaning"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                    >
                        ● {room.status}
                    </span>
                </div>

                <button
                    className="mt-6 flex items-center justify-center w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[2px] hover:bg-indigo-600 transition-all active:scale-95"

                    onClick={() => {
                        setSelectedRoom(room);
                        setActivePage('book-walkin');
                    }}
                >
                    Book This Room
                </button>

            </div>
        </div>
    );
};

export default AddBookings;


