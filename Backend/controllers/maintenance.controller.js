const Maintenance =
require("../models/maintenance.model");

const Room =
require("../models/room.model");

const Booking =
require("../models/booking.model");


// CONSUMED ---
// ======================================================
// REPORT MAINTENANCE ISSUE
// ======================================================

exports.reportMaintenance = async (req, res, next) => {

    try {

        const {
            roomId,
            issue
        } = req.body;

        // ======================================================
        // VALIDATION
        // ======================================================

        if (!roomId || !issue) {

            return res.status(400).json({
                success: false,
                msg: "Room and issue are required"
            });
        }

        // ======================================================
        // ROOM CHECK
        // ======================================================

        const room = await Room.findById(roomId);

        if (!room) {

            return res.status(404).json({
                success: false,
                msg: "Room not found"
            });
        }

        // ======================================================
        // GUEST VALIDATION
        // ONLY CHECKED-IN / CHECKED-OUT GUEST
        // CAN REPORT ISSUE
        // ======================================================

        if (req.user.guestId) {

            const validBooking =
            await Booking.findOne({

                guest: req.user.guestId,

                room: roomId,

                status: {
                    $in: [
                        "checked_in",
                        "checked_out"
                    ]
                }

            });

            if (!validBooking) {

                return res.status(403).json({
                    success: false,
                    msg:
                    "Only checked-in or checked-out guests can report maintenance issues"
                });
            }
        }

        // ======================================================
        // CREATE REQUEST
        // ======================================================

        const maintenance =
        await Maintenance.create({

            room: roomId,

            reportedByGuest:
                req.user.guestId || null,

            reportedByStaff:
                req.user.staffId || null,

            issue

        });

        // ======================================================
        // UPDATE ROOM STATUS
        // ======================================================

        room.status = "maintenance";

        room.isAvailable = false;

        await room.save();

        // ======================================================
        // RESPONSE
        // ======================================================

        res.status(201).json({

            success: true,

            msg:
            "Maintenance issue reported successfully",

            maintenance
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// GET ALL MAINTENANCE REQUESTS
// ======================================================

exports.getAllMaintenanceRequests = async (req, res, next) => {

    try {

        const requests =
        await Maintenance.find()

            .populate("room")

            .populate(
                "reportedByGuest",
                "name email"
            )

            .populate(
                "reportedByStaff",
                "name email role"
            )

            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: requests.length,

            requests
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// RESOLVE MAINTENANCE REQUEST (ADMIN ONLY)
// ======================================================
exports.resolveMaintenance = async (req, res, next) => {

    try {

        const maintenance =
        await Maintenance.findById(req.params.id);

        if (!maintenance) {

            return res.status(404).json({
                success: false,
                msg:
                "Maintenance request not found"
            });
        }

        // ======================================================
        // ALREADY RESOLVED
        // ======================================================

        if (maintenance.status === "resolved") {

            return res.status(400).json({
                success: false,
                msg:
                "Maintenance request already resolved"
            });
        }

        // ======================================================
        // UPDATE REQUEST STATUS
        // ======================================================

        maintenance.status = "resolved";

        await maintenance.save();

        // ======================================================
        // UPDATE ROOM STATUS
        // ======================================================

        const room =
        await Room.findById(
            maintenance.room
        );

        if (room) {

            room.status = "available";

            room.isAvailable = true;

            await room.save();
        }

        // ======================================================
        // RESPONSE
        // ======================================================

        res.status(200).json({

            success: true,

            msg:
            "Maintenance request resolved successfully",

            maintenance
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// MARK MAINTENANCE AS IN_PROGRESS
// ======================================================
exports.markMaintenanceInProgress = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        msg: "Maintenance request not found"
      });
    }

    if (maintenance.status === "resolved") {
      return res.status(400).json({
        success: false,
        msg: "Already resolved request cannot be modified"
      });
    }

    maintenance.status = "in_progress";
    await maintenance.save();

    res.status(200).json({
      success: true,
      msg: "Maintenance marked as in progress",
      maintenance
    });

  } catch (error) {
    next(error);
  }
};