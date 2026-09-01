const express = require("express");

const router = express.Router();

const {
  generateBill,
  payBill,
  getAllInvoices,
  getSingleInvoice,
  getMyInvoices,
  guestPayBill
} = require("../controllers/billing.controller");

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");



// ======================================================
// GENERATE BILL
// ======================================================
router.post(
  "/generate",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "receptionist"),
  generateBill
);


// ======================================================
// PAY BILL
// ======================================================
router.patch(
  "/pay",
  authMiddleware.verifyToken,
  roleMiddleware("receptionist"),
  payBill
);


// ======================================================
// GET ALL INVOICES
// ======================================================
router.get(
  "/all-invoices",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "receptionist"),
  getAllInvoices
);



// ======================================================
// GET SINGLE INVOICE
// ======================================================
router.get(
  "/single-invoice/:id",
  authMiddleware.verifyToken,
  roleMiddleware("admin", "receptionist"),
  getSingleInvoice
);



// ======================================================
// GET MY INVOICES
// ======================================================
router.get(
  "/my-invoices",
  authMiddleware.verifyToken,
  roleMiddleware("guest"),
  getMyInvoices
);



// ======================================================
// GUEST ONLINE PAY 
// ======================================================
router.post(
  "/guest-pay",
  authMiddleware.verifyToken,
  guestPayBill
);

module.exports = router;