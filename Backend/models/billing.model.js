const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(

  {

    // ======================================================
    // REFERENCES
    // ======================================================

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true
    },



    // ======================================================
    // INVOICE NUMBER
    // ======================================================

    invoiceNumber: {
      type: String,
      unique: true
    },



    // ======================================================
    // CHARGES
    // ======================================================

    roomCharges: {
      type: Number,
      default: 0
    },

    serviceCharges: {
      type: Number,
      default: 0
    },

    taxPercentage: {
      type: Number,
      default: 0
    },

    taxAmount: {
      type: Number,
      default: 0
    },

    lateCheckoutFee: {
      type: Number,
      default: 0
    },



    // ======================================================
    // FINAL TOTAL
    // ======================================================

    totalAmount: {
      type: Number,
      required: true
    },



    // ======================================================
    // PAYMENT
    // ======================================================

    paymentStatus: {

      type: String,

      enum: [
        "unpaid",
        "paid"
      ],

      default: "unpaid"
    },

    paymentMethod: {

      type: String,

      enum: [
        "cash",
        "card",
        "online"
      ],

      default: null
    },

    paidAmount: {

      type: Number,

      default: 0
    },

    paidAt: {

      type: Date,

      default: null
    },



    // ======================================================
    // NOTES
    // ======================================================

    notes: {
      type: String,
      default: null
    }

  },

  { timestamps: true }

);



// ======================================================
// AUTO INVOICE NUMBER
// ======================================================

billingSchema.pre("save", async function () {

  // AUTO INVOICE NUMBER
  if (!this.invoiceNumber) {

    const count =
      await mongoose.model("Billing").countDocuments();

    this.invoiceNumber =
      `INV-${new Date().getFullYear()}-${1000 + count + 1}`;
  }

});

module.exports =
  mongoose.model("Billing", billingSchema);