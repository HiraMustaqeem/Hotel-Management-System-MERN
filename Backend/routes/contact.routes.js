// routes/contact.routes.js

const express = require("express");

const router = express.Router();

const {
  createContact,
  getAllContacts,
  deleteContact
} = require(
  "../controllers/contact.controller"
);

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");


  router.post(
  "/create",
  authMiddleware.verifyToken,
  createContact
);

router.get(
  "/all",
  authMiddleware.verifyToken,
  roleMiddleware(
    "admin",
    "manager"
  ),
  getAllContacts
);


router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  roleMiddleware(
    "admin",
    "manager"
  ),
  deleteContact
);

module.exports = router;