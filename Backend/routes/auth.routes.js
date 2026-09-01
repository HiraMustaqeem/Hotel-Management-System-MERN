// routes/auth.routes.js

const express = require("express");

const router = express.Router();

const {
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
} = require("../controllers/auth.controller");

const authMiddleware =
require("../middlewares/auth.middleware");

// ======================================================
// Login 
// ======================================================

router.post("/login", login);


// ======================================================
// Logout 
// ======================================================
router.post("/logout", logout);


// ======================================================
// FORGOT PASSWORD
// ======================================================

router.post(
    "/forgot-password",
    forgotPassword
);


// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
    "/reset-password/:token",
    resetPassword
);

// ======================================================
// CHANGE PASSWORD
// ======================================================

router.patch(
    "/change-password",
    authMiddleware.verifyToken,
    changePassword
);

module.exports = router;