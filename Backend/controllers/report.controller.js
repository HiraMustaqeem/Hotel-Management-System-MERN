const Booking = require("../models/booking.model");
const Billing = require("../models/billing.model");
const Room = require("../models/room.model");
const Guest = require("../models/guest.model");
const Feedback = require("../models/feedback.model");
const Maintenance = require("../models/maintenance.model");
const Staff = require("../models/staff.model");


// CONSUMED ---
// ======================================================
// MOST BOOKED ROOM TYPE
// ======================================================

exports.getMostBookedRoomType = async (req, res, next) => {

    try {

        const result =
        await Booking.aggregate([

            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomData"
                }
            },

            {
                $unwind: "$roomData"
            },

            {
                $group: {
                    _id: "$roomData.roomType",
                    totalBookings: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    totalBookings: -1
                }
            },

            {
                $limit: 1
            }

        ]);

        res.status(200).json({

            success: true,

            mostBookedRoomType:
                result[0] || null
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// TOP SERVICES
// ======================================================
exports.getTopServices = async (req, res, next) => {

    try {

        const result =
        await Booking.aggregate([

            {
                $unwind: "$services"
            },

            {
                $group: {
                    _id: "$services.name",
                    totalRequests: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    totalRequests: -1
                }
            }

        ]);

        res.status(200).json({

            success: true,

            services: result
        });

    } catch (error) {

        next(error);
    }
}; 



// CONSUMED ---
// ======================================================
// MONTHLY REVENUE
// ======================================================
exports.getMonthlyRevenue = async (req, res, next) => {

    try {

        const revenue =
        await Billing.aggregate([

            {
                $match: {
                    paymentStatus: "paid"
                }
            },

            {
                $group: {

                    _id: {
                        month: {
                            $month: "$paidAt"
                        },

                        year: {
                            $year: "$paidAt"
                        }
                    },

                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }

        ]);

        res.status(200).json({

            success: true,

            revenue
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// OCCUPANCY RATE
// ======================================================
exports.getOccupancyRate = async (req, res, next) => {

    try {

        const totalRooms =
            await Room.countDocuments();

        const occupiedRooms =
            await Room.countDocuments({
                status: "occupied"
            });

        const occupancyRate =
            totalRooms === 0
                ? 0
                : (
                    (occupiedRooms / totalRooms) * 100
                ).toFixed(2);

        res.status(200).json({

            success: true,

            totalRooms,

            occupiedRooms,

            occupancyRate:
                `${occupancyRate}%`
        });

    } catch (error) {

        next(error);
    }
};



// CONSUMED ---
// ======================================================
// BOOKINGS REPORT
// ======================================================
exports.getBookingsReport = async (req, res, next) => {

    try {

        const totalBookings =
            await Booking.countDocuments();

        const pendingBookings =
            await Booking.countDocuments({
                status: "pending"
            });

        const confirmedBookings =
            await Booking.countDocuments({
                status: "confirmed"
            });

        const checkedInBookings =
            await Booking.countDocuments({
                status: "checked_in"
            });

        const checkedOutBookings =
            await Booking.countDocuments({
                status: "checked_out"
            });

        const cancelledBookings =
            await Booking.countDocuments({
                status: "cancelled"
            });

        res.status(200).json({

            success: true,

            report: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                checkedInBookings,
                checkedOutBookings,
                cancelledBookings
            }

        });

    } catch (error) {

        next(error);

    }

};



// CONSUMED ---
// ======================================================
// ROOMS REPORT
// ======================================================
exports.getRoomsReport = async (req, res, next) => {

    try {

        const totalRooms =
            await Room.countDocuments();

        const availableRooms =
            await Room.countDocuments({
                status: "available"
            });

        const occupiedRooms =
            await Room.countDocuments({
                status: "occupied"
            });

        const cleaningRooms =
            await Room.countDocuments({
                status: "cleaning"
            });

        const maintenanceRooms =
            await Room.countDocuments({
                status: "maintenance"
            });

        res.status(200).json({

            success: true,

            report: {
                totalRooms,
                availableRooms,
                occupiedRooms,
                cleaningRooms,
                maintenanceRooms
            }

        });

    } catch (error) {

        next(error);

    }

};



// CONSUMED ---
// ======================================================
// STAFF REPORT
// ======================================================
exports.getStaffReport = async (req, res, next) => {

    try {

        const totalStaff =
            await Staff.countDocuments();

        const activeStaff =
            await Staff.countDocuments({
                isActive: true
            });

        const inActiveStaff =
            await Staff.countDocuments({
                isActive: false
            });

        const totalManager =
            await Staff.countDocuments({
                role: "manager"
            });

        const totalReceptionist =
            await Staff.countDocuments({
                role: "receptionist"
            });

        const totalHousekeeper =
            await Staff.countDocuments({
                role: "housekeeping"
            });

        res.status(200).json({

            success: true,

            report: {
                totalStaff,
                activeStaff,
                inActiveStaff,
                totalManager,
                totalReceptionist,
                totalHousekeeper
            }

        });

    } catch (error) {

        next(error);

    }

};


// CONSUMED ---
// ======================================================
// FEEDBACK REPORT
// ======================================================
exports.getFeedbackReport = async (req, res, next) => {

    try {

        const totalFeedbacks =
            await Feedback.countDocuments();

        const feedbacks =
            await Feedback.find();

        let averageRating = 0;

        if (feedbacks.length > 0) {

            const totalRatings =
                feedbacks.reduce(
                    (acc, item) => acc + item.rating,
                    0
                );

            averageRating =
                totalRatings / feedbacks.length;
        }

        res.status(200).json({

            success: true,

            report: {
                totalFeedbacks,
                averageRating:
                    Number(averageRating.toFixed(1))
            }

        });

    } catch (error) {

        next(error);

    }

};



// CONSUMED ---
// ======================================================
// MAINTENANCE REPORT
// ======================================================

exports.getMaintenanceReport = async (req, res, next) => {

    try {

        const totalMaintenanceRequests =
            await Maintenance.countDocuments();

        const inProcessMaintenanceRequests =
            await Maintenance.countDocuments({
                status: "in_progress"
            });

        const resolvedMaintenanceRequests =
            await Maintenance.countDocuments({
                status: "resolved"
            });

        res.status(200).json({

            success: true,

            report: {
                totalMaintenanceRequests,
                inProcessMaintenanceRequests,
                resolvedMaintenanceRequests
            }

        });

    } catch (error) {

        next(error);

    }

};