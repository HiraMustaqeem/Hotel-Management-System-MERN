const express = require("express");

const router = express.Router();

const {

  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
  deleteRoomImage,
  allRooms,
  getAvailableRooms,
  getCleaningRooms
} = require("../controllers/room.controller");


const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

const upload =
  require("../middlewares/upload.middleware");


// ==============================
// CREATE ROOM
// ADMIN ONLY
// ==============================
router.post(
  "/create-room",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  upload.array("roomImages", 5),
  createRoom
);



// ==============================
// GET ALL ROOMS
// ==============================
router.get(
  "/all-rooms",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "manager", "receptionist", "housekeeping"),
  getAllRooms

);




// ==============================
// GET SINGLE ROOM
// ==============================
router.get(
  "/single-room/:id",
  authMiddleware.verifyToken,
  getSingleRoom
);




// ==============================
// UPDATE ROOM
// ADMIN ONLY
// ==============================
router.patch(
  "/update-room/:id",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  upload.array("roomImages", 5),
  updateRoom
);




// ==============================
// DELETE SINGLE ROOM IMAGE
// ADMIN ONLY
// ==============================
router.delete(
  "/delete-room-image/:id/:imageName",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  deleteRoomImage
);



// ==============================
// DELETE ROOM
// ADMIN ONLY
// ==============================
router.delete(
  "/delete-room/:id",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  deleteRoom
);



// ==============================
// UPDATE ROOM STATUS
// HOUSEKEEPING
// ==============================
router.patch(
  "/update-room-status/:id",
  authMiddleware.verifyToken,
  roleMiddleware(
    "admin",
  ),
  updateRoomStatus
);


// ==============================
// GET ALL ROOMS
// ==============================
router.get(
  "/see-all-rooms",
  allRooms

);


// ==============================
// Available Rooms 
// ==============================
router.get(
  "/available",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist", "housekeeping", "manager"),
  getAvailableRooms
);


router.get(
  "/cleaning",
  authMiddleware.verifyToken,
  roleMiddleware(
    "receptionist",
    "housekeeping",
    "manager"
  ),
  getCleaningRooms
);


module.exports = router;