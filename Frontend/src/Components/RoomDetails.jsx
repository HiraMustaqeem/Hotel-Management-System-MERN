import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoom();
    }, []);

    const fetchRoom = async () => {
        try {
            setLoading(true);

            const res = await API.get(`/rooms/${id}`);

            setRoom(res.data.room);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!room) return <div>Room not found</div>;

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold">{room.roomNumber}</h1>

            <p className="text-gray-500">{room.description}</p>

            <p className="font-bold text-indigo-600">
                Rs. {room.price}
            </p>

            {/* IMAGES */}
            <div className="flex gap-3 mt-4">
                {room.roomImages?.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        className="w-40 h-28 object-cover rounded-lg"
                    />
                ))}
            </div>

            {/* BOOK BUTTON */}
            <button
                onClick={() => navigate(`/booking/${room._id}`)}
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
                Book This Room
            </button>

        </div>
    );
}

export default RoomDetails;