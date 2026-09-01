const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

// ==============================
// TRANSFER ROOM
// ==============================
exports.transferRoom = async (req, res, next) => {

    try {

        const bookingId = req.params.id;   
        const { newRoomId, reason } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        if (booking.status !== "checked_in") {
            return res.status(400).json({
                success: false,
                msg: "Room transfer allowed only after check-in"
            });
        }

        const oldRoomId = booking.room;

        const newRoom = await Room.findById(newRoomId);

        if (!newRoom) {
            return res.status(404).json({
                success: false,
                msg: "New room not found"
            });
        }

        if (newRoom.status !== "available") {
            return res.status(400).json({
                success: false,
                msg: "Selected room is not available"
            });
        }

        booking.roomTransfers.push({
            fromRoom: oldRoomId,
            toRoom: newRoomId,
            reason: reason || "Guest request"
        });

        booking.room = newRoomId;

        await booking.save();

        await Room.findByIdAndUpdate(oldRoomId, {
            status: "cleaning",
            isAvailable: false
        });

        await Room.findByIdAndUpdate(newRoomId, {
            status: "occupied",
            isAvailable: false
        });

        res.status(200).json({
            success: true,
            msg: "Room transferred successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


