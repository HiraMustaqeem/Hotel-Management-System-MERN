const Billing = require("../models/billing.model");
const sendEmail = require("./sendEmail");

const sendInvoiceEmail = async (billId) => {

  const populatedBill = await Billing.findById(billId)
    .populate("guest")
    .populate("booking");

  await sendEmail({

    email: populatedBill.guest.email,

    subject: "LuxuryStay Payment Confirmation",

    message: `

      <h2>Payment Successful</h2>

      <p>Your payment has been received successfully.</p>

      <p><strong>Invoice Number:</strong> ${populatedBill.invoiceNumber}</p>

      <p><strong>Total Amount:</strong> PKR ${populatedBill.totalAmount}</p>

      <p><strong>Payment Method:</strong> ${populatedBill.paymentMethod}</p>

      <p><strong>Payment Status:</strong> ${populatedBill.paymentStatus}</p>

      <br>

      <p>Thank you for choosing LuxuryStay.</p>
    `
  });

};

module.exports = sendInvoiceEmail;