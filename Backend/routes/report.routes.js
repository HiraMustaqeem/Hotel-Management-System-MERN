const express = require("express");

const router = express.Router();
const Staff = require("../models/staff.model");
const {
    getDashboardReport,
    getMostBookedRoomType,
    getTopServices,
    getMonthlyRevenue,
    getOccupancyRate,

    getBookingsReport,
    getRoomsReport,
    getStaffReport,
    getFeedbackReport,
    getMaintenanceReport

} = require("../controllers/report.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");

const roleMiddleware =
    require("../middlewares/role.middleware");


// ======================================================
// MOST BOOKED ROOM TYPE
// ======================================================

router.get(
    "/most-booked-room-type",
    authMiddleware.verifyToken,
    roleMiddleware("admin, manager"),
    getMostBookedRoomType
);


// ======================================================
// TOP SERVICES
// ======================================================

router.get(
    "/top-services",
    authMiddleware.verifyToken,
    roleMiddleware("admin, manager"),
    getTopServices
);


// ======================================================
// MONTHLY REVENUE
// ======================================================

router.get(
    "/monthly-revenue",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    getMonthlyRevenue
);


// ======================================================
// OCCUPANCY RATE
// ======================================================

router.get(
    "/occupancy-rate",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    getOccupancyRate
);



// ======================================================
// BOOKINGS REPORT
// ======================================================

router.get(
    "/bookings",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager", "receptionist"),
    getBookingsReport
);



// ======================================================
// ROOMS REPORT
// ======================================================

router.get(
    "/rooms",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager", "receptionist", "housekeeping"),
    getRoomsReport
);



// ======================================================
// STAFF REPORT
// ======================================================

router.get(
    "/staff",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager"),
    getStaffReport
);



// ======================================================
// FEEDBACK REPORT
// ======================================================

router.get(
    "/feedbacks",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager"),
    getFeedbackReport
);



// ======================================================
// MAINTENANCE REPORT
// ======================================================

router.get(
    "/maintenance",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager"),
    getMaintenanceReport
);

module.exports = router;