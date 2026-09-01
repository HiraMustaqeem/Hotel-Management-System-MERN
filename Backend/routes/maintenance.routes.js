const express = require("express");

const router = express.Router();

const {
    reportMaintenance,
    getAllMaintenanceRequests,
    resolveMaintenance,
    markMaintenanceInProgress
} = require("../controllers/maintenance.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");

const roleMiddleware =
    require("../middlewares/role.middleware");


// ======================================================
// REPORT MAINTENANCE
// GUEST + STAFF
// ======================================================

router.post(
    "/report",
    authMiddleware.verifyToken,
    reportMaintenance
);


// ======================================================
// GET ALL MAINTENANCE REQUESTS
// ADMIN ONLY
// ======================================================

router.get(
    "/all",
    authMiddleware.verifyToken,
    roleMiddleware("admin", "manager"),
    getAllMaintenanceRequests
);


// ======================================================
// RESOLVE MAINTENANCE
// ADMIN ONLY
// ======================================================

router.patch(
    "/resolve/:id",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    resolveMaintenance
);


// ======================================================
// MARK IN PROGRESS
// ======================================================

router.patch(
  "/in-progress/:id",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  markMaintenanceInProgress
);

module.exports = router;