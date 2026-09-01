const express = require("express");

const router = express.Router();

const {
    createFeedback,
    getAllFeedbacks,
    deleteFeedback,
    allFeedbacks
} = require("../controllers/feedback.controller");

const authMiddleware =
require("../middlewares/auth.middleware");

const roleMiddleware =
require("../middlewares/role.middleware");


// ======================================================
// CREATE FEEDBACK (GUEST)
// ======================================================

router.post(
    "/create",
    authMiddleware.verifyToken,
    createFeedback
);


// ======================================================
// GET ALL FEEDBACKS (ADMIN ONLY)
// ======================================================

router.get(
    "/all",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager"),
    getAllFeedbacks
);


// ======================================================
// DELETE FEEDBACK (ADMIN ONLY)
// ======================================================

router.delete(
    "/delete/:id",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    deleteFeedback
);


// ======================================================
// GET FEEDBACKS BY GUEST
// ======================================================
router.get(
  "/all-feedbacks",
  allFeedbacks
);


module.exports = router;