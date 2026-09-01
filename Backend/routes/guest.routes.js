const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

const {
  registerGuest,
  loginGuest,
  logoutGuest,
  createWalkinGuest,
  testEmail,
  setPassword,
  forgotPasswordGuest,
  resetPasswordGuest,
  changeGuestPassword,
  removeProfileImage,
  getAllGuests,

   getMyProfile,
  updateMyProfile
} = require("../controllers/guest.controller");


const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

// ======================================================
// REGISTER
// ======================================================
router.post(
  "/register",
  registerGuest
);



// ======================================================
// LOGIN
// ======================================================
router.post(
  "/login",
  loginGuest
);



// ======================================================
// LOGOUT
// ======================================================
router.post(
  "/logout",
  logoutGuest
);




// ======================================================
// MY PROFILE
// ======================================================
router.get(
  "/my-profile",
  authMiddleware.verifyToken,
  getMyProfile
);




// ======================================================
// UPDATE PROFILE
// ======================================================
router.patch(
  "/update-profile",
  authMiddleware.verifyToken,
  upload.single("profileImage"),
  updateMyProfile
);



// ======================================================
// REMOVE PROFILE IMAGE
// ======================================================
router.delete(
  "/remove-profile-image",
  authMiddleware.verifyToken,
  removeProfileImage
);



// ======================================================
// CREATE WALK-IN GUEST
// ======================================================
router.post(
  "/create-walkin",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  createWalkinGuest
);


// ======================================================
// TEST MAIL
// ======================================================
router.get(
  "/test-email",
  testEmail
);



// ======================================================
// SET PASSWORD FOR WALK-IN GUESTS
// ======================================================
router.post(
  "/set-password",
  setPassword
);



// ======================================================
// GUEST FORGOT PASSWORD
// ======================================================
router.post(
  "/forgot-password",
  forgotPasswordGuest
);


// ======================================================
// GUEST RESET PASSWORD
// ======================================================
router.post(
  "/reset-password/:token",
  resetPasswordGuest
);


// ======================================================
// GUEST CHANGE PASSWORD
// ======================================================
router.patch(
  "/change-password",
  authMiddleware.verifyToken,
  changeGuestPassword
);


// ======================================================
// GET ALL GUEST (MANAGER/ADMIN) 
// ======================================================
router.get(
  "/all",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "manager", "receptionist"),
  getAllGuests
);

module.exports = router;