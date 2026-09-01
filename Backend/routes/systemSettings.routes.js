const express = require("express");

const router = express.Router();

const {

  getSettings,
  updateSettings

} = require(
  "../controllers/systemSettings.controller"
);

const authMiddleware =
require("../middlewares/auth.middleware");

const roleMiddleware =
require("../middlewares/role.middleware");



// ======================================================
// GET SETTINGS
// ======================================================
router.get(
  "/",
  authMiddleware.verifyToken,
  getSettings
);



// ======================================================
// SAVE / UPDATE SETTINGS
// ======================================================
router.patch(
  "/update",
  authMiddleware.verifyToken,
  roleMiddleware("admin"),
  updateSettings
);

module.exports = router;