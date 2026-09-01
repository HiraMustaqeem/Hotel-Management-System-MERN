const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  cancelBooking,
  checkIn,
  checkOut,
  checkAvailability,
  confirmBooking,
  
  // GUEST APIs
  selfBooking,
  getMyBookings,
  getMySingleBooking,
  cancelMyBooking,
  getMyActiveBookings,
  getMyCompletedBookings,
  getMyCancelledBookings
} = require("../controllers/booking.controller");

const {
  transferRoom
} = require("../controllers/roomTransfer.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");


// ======================================================
// CREATE BOOKING
// ======================================================
router.post(
  "/create-booking",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  createBooking
);


// ======================================================
// CHECK AVAILABILITY
// ======================================================
router.post(
  "/check-availability",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  checkAvailability
);


// ======================================================
// GET ALL BOOKINGS
// ======================================================
router.get(
  "/all-bookings",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "receptionist", "manager"),
  getAllBookings
);


// ======================================================
// GET SINGLE BOOKING (ADDED PROPERLY)
// ======================================================
router.get(
  "/single-booking/:id",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "receptionist"),
  getSingleBooking
);


// ======================================================
// UPDATE BOOKING
// ======================================================
router.patch(
  "/update-booking/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  updateBooking
);



// ======================================================
// CANCEL BOOKING
// ======================================================
router.patch(
  "/cancel-booking/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  cancelBooking
);



// ======================================================
// CHECK IN
// ======================================================
router.patch(
  "/checkin/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  checkIn
);



// ======================================================
// CHECK OUT
// ======================================================
router.patch(
  "/checkout/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  checkOut
);



// ======================================================
// CONFIRM BOOKING
// ======================================================
router.patch(
  "/confirm-booking/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  confirmBooking
);



// ======================================================
// TRANSFER ROOM
// ======================================================
router.post(
  "/transfer-room/:id",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  transferRoom
);





// =======================================================================================================
// -------------------------------------------------------------------------------------------------------
// =======================================================================================================

// GUEST APIs

// ========================================================================================================
// --------------------------------------------------------------------------------------------------------
// ========================================================================================================





// ======================================================
// SELF BOOKING
// ======================================================
router.post(
  "/self-book",
  authMiddleware.verifyToken,
  selfBooking
);



// ======================================================
// MY BOOKINGS
// ======================================================
router.get(
  "/my-bookings",
  authMiddleware.verifyToken,
  getMyBookings
);



// ======================================================
// SINGLE MY BOOKING
// ======================================================
router.get(
  "/my-bookings/:id",
  authMiddleware.verifyToken,
  getMySingleBooking
);



// ======================================================
// CANCEL MY BOOKING
// ======================================================
router.patch(
  "/cancel-my-booking/:id",
  authMiddleware.verifyToken,
  cancelMyBooking
);



// ======================================================
// GET MY ACTIVE BOOKING
// ======================================================
router.get(
  "/my-active-bookings",
  authMiddleware.verifyToken,
  getMyActiveBookings
);



// ======================================================
// GET MY COMPLETED BOOKING
// ======================================================
router.get(
  "/my-completed-bookings",
  authMiddleware.verifyToken,
  getMyCompletedBookings
);



// ======================================================
// GET MY CANCELLED BOOKING
// ======================================================
router.get(
  "/my-cancelled-bookings",
  authMiddleware.verifyToken,
  getMyCancelledBookings
);


module.exports = router;