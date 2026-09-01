const express = require("express");

const router = express.Router();

const {
  getDashboardCards
} = require("../controllers/dashboard.controller");

const authMiddleware =
require("../middlewares/auth.middleware");

const roleMiddleware =
require("../middlewares/role.middleware");




// ======================================================
// DASHBOARD CARDS
// ======================================================

router.get(
  "/cards",
  authMiddleware.verifyToken,
roleMiddleware("admin", "receptionist", "manager"),
  getDashboardCards
);


module.exports = router;