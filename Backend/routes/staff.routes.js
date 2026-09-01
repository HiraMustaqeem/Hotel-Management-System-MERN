const express = require("express");

const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    deleteProfileImage
} = require("../controllers/staff.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");


// GET MY PROFILE
router.get(
    "/my-profile",
    authMiddleware.verifyToken,
    getMyProfile,
);

// UPDATE MY PROFILE
router.patch(
    "/update-profile",
    authMiddleware.verifyToken,
    upload.single("profileImage"),
    updateMyProfile
);


router.delete(
    "/delete-profile-image",
    authMiddleware.verifyToken,
    deleteProfileImage
);




module.exports = router;