const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

// CONSUMED ---
// ======================================================
// CREATE BOOKING (STAFF ONLY)
// ======================================================
exports.createBooking = async (req, res, next) => {
  try {
    const { guest, room, checkInDate, checkOutDate } = req.body;
    const staffId = req.user.staffId;

    // ======================================================
    // VALIDATION: REQUIRED FIELDS
    // ======================================================
    if (!guest || !room || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // ======================================================
    // CHECK ROOM EXISTS
    // ======================================================
    const roomData = await Room.findById(room);

    if (!roomData) {
      return res.status(404).json({
        success: false,
        msg: "Room not found",
      });
    }

    // ======================================================
    // CHECK ROOM AVAILABILITY
    // ======================================================
    if (roomData.status !== "available") {
      return res.status(400).json({
        success: false,
        msg: "Room is currently not available",
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // ======================================================
    // NORMALIZE DATES (REMOVE TIME)
    // ======================================================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // ======================================================
    // CHECK-IN SHOULD NOT BE IN PAST
    // ======================================================
    if (start < today) {
      return res.status(400).json({
        success: false,
        msg: "Check-in date cannot be in the past",
      });
    }

    // ======================================================
    // CHECK CHECK-OUT VALIDITY
    // ======================================================
    if (end <= start) {
      return res.status(400).json({
        success: false,
        msg: "Check-out date must be after check-in date",
      });
    }

    // ======================================================
    // CHECK OVERLAPPING BOOKINGS
    // ======================================================
    const overlappingBooking = await Booking.findOne({
      room,
      status: { $ne: "cancelled" },
      $or: [
        {
          checkInDate: { $lt: end },
          checkOutDate: { $gt: start },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        msg: "Room is already booked for selected dates",
      });
    }

    // ======================================================
    // CALCULATE TOTAL PRICE
    // ======================================================
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * roomData.price;

    // ======================================================
    // CREATE BOOKING
    // ======================================================
    const booking = await Booking.create({
      guest,
      room,
      staff: staffId,
      checkInDate: start,
      checkOutDate: end,
      totalPrice,
      status: "confirmed",
      preferences: req.body.preferences || [],
      services: req.body.services || [],
    });

    // ======================================================
    // RESPONSE
    // ======================================================
    return res.status(201).json({
      success: true,
      msg: "Booking created successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};


// CONSUMED ---
// ======================================================
// GET ALL BOOKINGS
// ======================================================
exports.getAllBookings = async (req, res, next) => {

    try {

      const bookings = await Booking.find()
    .populate("guest", "name email")
    .populate("room", "roomNumber roomType price status")
    .populate("staff", "name email role")
    .populate("services.serviceId", "name");
    

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// GET SINGLE BOOKING
// ======================================================
exports.getSingleBooking = async (req, res, next) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate("guest")
            .populate("room")
            .populate("staff");

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// UPDATE BOOKING
// ======================================================
exports.updateBooking = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            room,
            checkInDate,
            checkOutDate,
            services   
        } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                msg: "Cancelled booking cannot be updated"
            });
        }

        if (["checked_in", "checked_out"].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                msg: "Cannot update after check-in or checkout"
            });
        }

        const newRoom = room || booking.room;
        const start = new Date(checkInDate || booking.checkInDate);
        const end = new Date(checkOutDate || booking.checkOutDate);

        if (start >= end) {
            return res.status(400).json({
                success: false,
                msg: "Invalid date range"
            });
        }

       const overlap = await Booking.findOne({
  _id: { $ne: id },
  room: newRoom,
  status: { $nin: ["cancelled", "checked_out"] },
  $or: [
    {
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start }
    }
  ]
});

        if (overlap) {
            return res.status(400).json({
                success: false,
                msg: "Room already booked for selected dates"
            });
        }

        const roomData = await Room.findById(newRoom);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        booking.room = newRoom;
        booking.checkInDate = start;
        booking.checkOutDate = end;
        booking.totalPrice = diffDays * roomData.price;

        if (services) {
            booking.services = services; 
        }

        await booking.save();

        res.status(200).json({
            success: true,
            msg: "Booking updated successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// CANCEL BOOKING
// ======================================================
exports.cancelBooking = async (req, res, next) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        const invalidStatuses = ["checked_in", "checked_out"];

        if (invalidStatuses.includes(booking.status)) {
            return res.status(400).json({
                success: false,
                msg: "Cannot cancel booking after check-in or completion"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                msg: "Booking already cancelled"
            });
        }

        if (!["pending", "confirmed"].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                msg: "Booking cannot be cancelled at this stage"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        await Room.findByIdAndUpdate(
            booking.room,
            {
                status: "available",
                isAvailable: true
            }
        );

        return res.status(200).json({
            success: true,
            msg: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// CHECK IN
// ======================================================
exports.checkIn = async (req, res, next) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        if (booking.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                msg: "Only confirmed bookings can check in"
            });
        }

        const now = new Date();

        if (booking.checkInDate > now) {
            return res.status(400).json({
                success: false,
                msg: "Check-in date not reached yet"
            });
        }

        booking.status = "checked_in";
        await booking.save();

        await Room.findByIdAndUpdate(booking.room, {
            status: "occupied",
            isAvailable: false
        });

        res.status(200).json({
            success: true,
            msg: "Guest checked in successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// CHECK OUT
// ======================================================
exports.checkOut = async (req, res, next) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        if (booking.status !== "checked_in") {
            return res.status(400).json({
                success: false,
                msg: "Guest has not checked in yet"
            });
        }

        booking.status = "checked_out";
        await booking.save();

        await Room.findByIdAndUpdate(
            booking.room,
            {
                status: "cleaning",
                isAvailable: false
            }
        );

        res.status(200).json({
            success: true,
            msg: "Guest checked out successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// CONFIRM BOOKING
// ======================================================
exports.confirmBooking = async (req, res, next) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        // only pending booking can be confirmed
        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                msg: "Only pending bookings can be confirmed"
            });
        }

        // 🟢 ASSIGN STAFF WHO CONFIRMED BOOKING
        booking.staff = req.user.staffId;

        // 🟢 UPDATE STATUS
        booking.status = "confirmed";

        await booking.save();

        res.status(200).json({
            success: true,
            msg: "Booking confirmed successfully",
            booking
        });


        // changed
        const bookings = await Booking.find()
  .populate("guest")
  .populate("room")
  .lean();

for (let booking of bookings) {

  const existingBill = await Billing.findOne({
    booking: booking._id
  });

  booking.billGenerated = !!existingBill;
}

const formattedBookings = await Promise.all(
  bookings.map(async (booking) => {

    const existingBill = await Billing.findOne({
      booking: booking._id
    });

    return {
      ...booking._doc,
      billGenerated: !!existingBill
    };
  })
);

res.status(200).json({
  success: true,
  bookings: formattedBookings
});

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// CHECK AVAILABILITY
// ======================================================
exports.checkAvailability = async (req, res, next) => {

    try {

        console.log("BODY:", req.body);

        const { roomId, checkInDate, checkOutDate } = req.body;

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        const roomExists = await Room.findOne({
            roomNumber: roomId
        });

        console.log("ROOM:", roomExists);

        if (!roomExists) {

            return res.status(404).json({
                success: false,
                msg: "Room not found"
            });
        }

        console.log("ROOM STATUS:", roomExists.status);

        if (
            roomExists.status &&
            roomExists.status.toLowerCase() !== "available"
        ) {

            return res.status(200).json({
                success: true,
                available: false,
                msg: "Room not available due to current status"
            });
        }

        const overlap = await Booking.findOne({

            room: roomExists._id,

            status: {
                $ne: "cancelled"
            },

            checkInDate: { $lt: end },

            checkOutDate: { $gt: start }

        });

        console.log("OVERLAP:", overlap);

        if (overlap) {

            return res.status(200).json({
                success: true,
                available: false,
                msg: "Room already booked for selected dates"
            });
        }

        return res.status(200).json({
            success: true,
            available: true,
            msg: "Room available"
        });

    } catch (error) {

        console.log("CHECK AVAILABILITY ERROR:", error);

        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


// CONSUMED ---
// ======================================================
// SELF BOOKING (ONLINE GUEST)
// ======================================================
exports.selfBooking = async (req, res, next) => {

    try {

        const {
            room,
            checkInDate,
            checkOutDate,
            services
        } = req.body;

        // guest from token
        const guestId = req.user.guestId;

        // VALIDATION
        if (!room || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }

        // ROOM EXISTS
        const roomData = await Room.findById(room);

        if (!roomData) {
            return res.status(404).json({
                success: false,
                msg: "Room not found"
            });
        }

        // ROOM STATUS
        if (roomData.status !== "available") {
            return res.status(400).json({
                success: false,
                msg: "Room is not available"
            });
        }

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        // ======================================================
        // REMOVE TIME FROM TODAY
        // ======================================================

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        start.setHours(0, 0, 0, 0);

        end.setHours(0, 0, 0, 0);

        // ======================================================
        // CHECK-IN SHOULD NOT BE PAST DATE
        // ======================================================

        if (start < today) {

            return res.status(400).json({
                success: false,
                msg: "Check-in date cannot be in the past"
            });
        }

        // ======================================================
        // CHECK-OUT SHOULD BE AFTER CHECK-IN
        // ======================================================

        if (end <= start) {

            return res.status(400).json({
                success: false,
                msg: "Check-out date must be after check-in date"
            });
        }

        // OVERLAP CHECK
        const overlap = await Booking.findOne({
            room,
            status: { $ne: "cancelled" },
            $or: [
                {
                    checkInDate: { $lt: end },
                    checkOutDate: { $gt: start }
                }
            ]
        });

        if (overlap) {
            return res.status(400).json({
                success: false,
                msg: "Room already booked for selected dates"
            });
        }

        // DAYS CALCULATION
        const diffTime = end.getTime() - start.getTime();

        const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        // ROOM PRICE
        const roomPrice = diffDays * roomData.price;

        // SERVICES PRICE
        let servicesTotal = 0;

        if (services && services.length > 0) {

            servicesTotal = services.reduce(
                (acc, item) => acc + item.price,
                0
            );

        }

        // FINAL TOTAL
        const totalPrice = roomPrice + servicesTotal;

        // CREATE BOOKING
        const booking = await Booking.create({

            guest: guestId,

            room,

            checkInDate: start,

            checkOutDate: end,

            totalPrice,

            status: "pending",

            services: services || []

        });

        res.status(201).json({
            success: true,
            msg: "Booking request submitted successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// CONSUMED ---
// ======================================================
// GET MY BOOKINGS
// ======================================================
exports.getMyBookings = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const bookings = await Booking.find({
            guest: guestId
        })
            .populate("room")
            .populate("staff", "name role")
            .populate({
                path: "services.serviceId",
                select: "name price"
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// GET MY SINGLE BOOKING
// ======================================================
exports.getMySingleBooking = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const booking = await Booking.findOne({
            _id: req.params.id,
            guest: guestId
        })
            .populate("room")
            .populate("staff", "name role");

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        next(error);
    }
};



// CONSUMED ---
// ======================================================
// CANCEL MY BOOKING
// ======================================================
exports.cancelMyBooking = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const booking = await Booking.findOne({
            _id: req.params.id,
            guest: guestId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                msg: "Booking not found"
            });
        }

        // only pending/confirmed
        if (!["pending", "confirmed"].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                msg: "Booking cannot be cancelled"
            });
        }

        // prevent cancellation after checkin date
        if (new Date() >= booking.checkInDate) {
            return res.status(400).json({
                success: false,
                msg: "Cannot cancel booking after check-in date"
            });
        }

        booking.status = "cancelled";

        await booking.save();

        // free room
        await Room.findByIdAndUpdate(
            booking.room,
            {
                status: "available",
                isAvailable: true
            }
        );

        res.status(200).json({
            success: true,
            msg: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// GET MY ACTIVE BOOKING
// ======================================================
exports.getMyActiveBookings = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const bookings = await Booking.find({
            guest: guestId,
            status: { $in: ["pending", "confirmed", "checked_in"] }
        })
            .populate("room")
            .populate("staff", "name role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// GET MY COMPLETED BOOKING
// ======================================================
exports.getMyCompletedBookings = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const bookings = await Booking.find({
            guest: guestId,
            status: "checked_out"
        })
            .populate("room")
            .populate("staff", "name role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};



// ======================================================
// GET MY CANCELLED BOOKING
// ======================================================
exports.getMyCancelledBookings = async (req, res, next) => {

    try {

        const guestId = req.user.guestId;

        const bookings = await Booking.find({
            guest: guestId,
            status: "cancelled"
        })
            .populate("room")
            .populate("staff", "name role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};