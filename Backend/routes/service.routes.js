const express = require("express");
const router = express.Router();

const {
    createService,
    getAllServices,
    updateService,
    deleteService
} = require("../controllers/service.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");


// ==============================
// CREATE SERVICE (ADMIN ONLY)
// ==============================
router.post(
    "/create",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    createService
);


// ==============================
// GET ALL SERVICES (PUBLIC FOR SYSTEM)
// ==============================
router.get(
    "/all",
    getAllServices
);


// ==============================
// UPDATE SERVICE (ADMIN ONLY)
// ==============================
router.patch(
    "/update/:id",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    updateService
);


// ==============================
// DELETE SERVICE (ADMIN ONLY)
// ==============================
router.delete(
    "/delete/:id",
    authMiddleware.verifyToken,
    roleMiddleware("admin"),
    deleteService
);

module.exports = router;