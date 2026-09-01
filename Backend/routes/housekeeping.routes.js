const express =
require("express");

const router =
express.Router();

const {
    markRoomAvailable,
    getCleaningTasks,
} = require(
    "../controllers/housekeeping.controller"
);

const authMiddleware =
require("../middlewares/auth.middleware");

const roleMiddleware =
require("../middlewares/role.middleware");


// ======================================================
// HOUSEKEEPER MARK ROOM AVAILABLE
// ======================================================
router.patch(
  "/update-status/:id",
  authMiddleware.verifyToken,
  roleMiddleware("housekeeping"),
  markRoomAvailable
);



// ======================================================
// GET CLEANING TASKS
// ======================================================
router.get(
    "/cleaning-tasks",
    authMiddleware.verifyToken,
    roleMiddleware("housekeeping"),
    getCleaningTasks
);


module.exports = router;