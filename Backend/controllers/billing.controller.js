const Billing = require("../models/billing.model");
const sendEmail = require("../utils/sendEmail");
const SystemSettings = require("../models/systemSettings.model");
const Booking = require("../models/booking.model");
const sendInvoiceEmail = require("../utils/sendInvoiceEmail");

// CONSUMED ---
// ======================================================
// GENERATE BILL
// ======================================================
exports.generateBill = async (req, res, next) => {

  try {

    const { bookingId } = req.body;

    // ======================================================
    // CHECK BOOKING
    // ======================================================

    const booking = await Booking.findById(bookingId)
      .populate("guest")
      .populate("room");

    if (!booking) {

      return res.status(404).json({
        success: false,
        msg: "Booking not found"
      });
    }



    // ======================================================
    // ONLY CHECKED OUT BOOKINGS
    // ======================================================

    const status = booking.status?.toLowerCase();
    if (status !== "checked_out") {
      return res.status(400).json({
        success: false,
        msg: "Bill can only be generated after checkout"
      });
    }



    // ======================================================
    // PREVENT DUPLICATE BILL
    // ======================================================

    const existingBill = await Billing.findOne({
      booking: booking._id
    });

    if (existingBill) {

      return res.status(400).json({
        success: false,
        msg: "Bill already generated"
      });
    }



    // ======================================================
    // ROOM CHARGES
    // ======================================================

    const roomCharges =
      booking.totalPrice || 0;



    // ======================================================
    // SERVICE CHARGES
    // ======================================================

    let serviceCharges = 0;

    booking.services.forEach(service => {

      serviceCharges += service.price;

    });



    // ======================================================
    // SETTINGS / TAX
    // ======================================================

    const settings =
      await SystemSettings.findOne();

    const taxPercentage =
      settings?.taxPercentage || 0;



    // ======================================================
    // TAX CALCULATION
    // ======================================================

    const subtotal =
      roomCharges + serviceCharges;

    const taxAmount =
      (subtotal * taxPercentage) / 100;



    // ======================================================
    // FINAL TOTAL
    // ======================================================

    const totalAmount =
      subtotal + taxAmount;



    // ======================================================
    // CREATE BILL
    // ======================================================

    const bill = await Billing.create({

      booking: booking._id,

      guest: booking.guest._id,

      roomCharges,

      serviceCharges,

      taxPercentage,

      taxAmount,

      totalAmount

    });
    // changed
    await Booking.findByIdAndUpdate(
  booking._id,
  {
    billGenerated: true
  }
);



    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(201).json({

      success: true,

      msg: "Bill generated successfully",

      bill

    });


  } catch (error) {

    next(error);

  }

};



// ======================================================
// PAY BILL
// ======================================================
exports.payBill = async (req, res, next) => {
  try {
    const { billId, amount, paymentMethod } = req.body;

    const bill = await Billing.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        msg: "Bill not found"
      });
    }

    if (bill.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        msg: "Bill already paid"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid payment amount"
      });
    }

    if (amount !== bill.totalAmount) {
      return res.status(400).json({
        success: false,
        msg: `Full payment required. Total bill is ${bill.totalAmount}`
      });
    }

    // ✅ PAYMENT UPDATE FIRST (IMPORTANT)
    bill.paidAmount = amount;
    bill.paymentMethod = paymentMethod;
    bill.paymentStatus = "paid";
    bill.paidAt = new Date();

    try {
  await bill.save();
} catch (err) {
  return next(err);
}

// EMAIL (NON BLOCKING SAFE WRAP)
setImmediate(() => {
  sendInvoiceEmail(bill._id)
    .then(() => console.log("Invoice email sent"))
    .catch((err) => console.log("Email failed:", err.message));
});

    // ======================================================
    // RESPONSE (DO NOT WAIT FOR EMAIL)
    // ======================================================
    return res.status(200).json({
      success: true,
      msg: "Bill paid successfully",
      bill
    });

  } catch (error) {
    next(error);
  }
};


// CONSUMED ---
// ======================================================
// GET ALL INVOICES
// ======================================================
exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await Billing.find()
      .populate("guest", "name email")
      .populate({
        path: "booking",
        populate: [
          { path: "room", select: "roomNumber roomType" }
        ]
      })
      .sort({ createdAt: -1 });

    // 🔥 IMPORTANT: Normalize response for frontend
    const formattedInvoices = invoices.map((inv) => ({
      id: inv._id,
      invoiceNumber: inv.invoiceNumber,

      guestName: inv.guest?.name || "Guest",
      guestEmail: inv.guest?.email || "",

      roomNumber: inv.booking?.room?.roomNumber || "N/A",
      roomType: inv.booking?.room?.roomType || "Room",

      roomCharges: inv.roomCharges,
      serviceCharges: inv.serviceCharges,
      taxAmount: inv.taxAmount,
      taxPercentage: inv.taxPercentage,

      totalAmount: inv.totalAmount,

      paymentStatus: inv.paymentStatus,
      paymentMethod: inv.paymentMethod,
      paidAmount: inv.paidAmount,
      paidAt: inv.paidAt,

      createdAt: inv.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedInvoices.length,
      invoices: formattedInvoices
    });

  } catch (error) {
    next(error);
  }
};


// ======================================================
// GET SINGLE INVOICE
// ======================================================
exports.getSingleInvoice = async (req, res, next) => {

  try {

    const invoice = await Billing.findById(req.params.id)

      .populate("guest", "name email contactNumber")

      .populate("booking");

    if (!invoice) {

      return res.status(404).json({
        success: false,
        msg: "Invoice not found"
      });
    }

    res.status(200).json({

      success: true,

      invoice

    });

  } catch (error) {

    next(error);
  }
};


// CONSUMED ---
// ======================================================
// GET MY INVOICES 
// ======================================================
exports.getMyInvoices = async (req, res, next) => {

  try {

    if (!req.user.guestId) {
      return res.status(403).json({
        success: false,
        msg: "Guest access only"
      });
    }

    const guestId = req.user.guestId;

    const invoices = await Billing.find({ guest: guestId })
      .populate("booking")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices
    });

  } catch (error) {
    next(error);
  }
};


// CONSUMED ---
// ======================================================
// GUEST PAY BILL (ONLINE PAYMENT)
// ======================================================
exports.guestPayBill = async (req, res, next) => {

  try {

    const {
      billId,
      amount
    } = req.body;

    // ======================================================
    // GUEST FROM TOKEN
    // ======================================================

    const guestId = req.user.guestId;

    if (!guestId) {

      return res.status(403).json({
        success: false,
        msg: "Guest access only"
      });
    }

    // ======================================================
    // FIND BILL
    // ======================================================

    const bill = await Billing.findById(billId);

    if (!bill) {

      return res.status(404).json({
        success: false,
        msg: "Bill not found"
      });
    }

    // ======================================================
    // OWNERSHIP CHECK
    // ======================================================

    if (bill.guest.toString() !== guestId) {

      return res.status(403).json({
        success: false,
        msg: "You can only pay your own bill"
      });
    }

    // ======================================================
    // ALREADY PAID
    // ======================================================

    if (bill.paymentStatus === "paid") {

      return res.status(400).json({
        success: false,
        msg: "Bill already paid"
      });
    }

    // ======================================================
    // FULL PAYMENT ONLY
    // ======================================================

    if (amount !== bill.totalAmount) {

      return res.status(400).json({
        success: false,
        msg: `Full payment required. Total bill is ${bill.totalAmount}`
      });
    }

    // ======================================================
    // UPDATE PAYMENT
    // ======================================================

    bill.paidAmount = amount;

    bill.paymentMethod = "online";

    bill.paymentStatus = "paid";

    bill.paidAt = new Date();

    await bill.save();

    // ======================================================
    // SEND EMAIL
    // ======================================================

// EMAIL QUEUE STYLE (SAFE & SCALABLE)
process.nextTick(() => {
  sendInvoiceEmail(bill._id)
    .catch(err => console.log("Email failed:", err.message));
});
    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Online payment successful",

      bill
    });

  } catch (error) {

    next(error);
  }
};