const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(

  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },
    
    checkInDate: {
      type: Date,
      required: true
    },

    checkOutDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled"
      ],
      default: "pending"
    },

    totalPrice: {
      type: Number,
      required: false
    },
    billGenerated: {
  type: Boolean,
  default: false
},

    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          default: null
        },
        name: String,
        price: Number
      }
    ],


    roomTransfers: [
      {
        fromRoom: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room"
        },
        toRoom: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room"
        },
        reason: {
          type: String,
          default: "Guest request"
        },
        transferredAt: {
          type: Date,
          default: Date.now
        }
      }
    ]

  },

  { timestamps: true }

);

module.exports = mongoose.model("Booking", bookingSchema);