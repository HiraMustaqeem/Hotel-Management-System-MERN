const express = require("express");
const router = express.Router();

const {
  createStaff,
  getAllStaff,
  updateStaff,
  toggleStaffStatus
} = require("../controllers/admin.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");


// CREATE STAFF
router.post(
  "/create-staff",
  verifyToken,
  roleMiddleware("admin"),
  createStaff
);


// GET ALL STAFF
router.get(
  "/all-staff",
  verifyToken,
  roleMiddleware("admin", "manager"),
  getAllStaff
);


// UPDATE STAFF
router.patch(
  "/update-staff/:id",
  verifyToken,
  roleMiddleware("admin"),
  updateStaff
);


// TOGGLE ACTIVE/INACTIVE STAFF
router.patch(
  "/toggle-status/:id",
  verifyToken,
  roleMiddleware("admin"),
  toggleStaffStatus
);

module.exports = router;