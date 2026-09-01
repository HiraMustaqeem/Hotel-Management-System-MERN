const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    taxPercentage: {
      type: Number,
      default: null
    },

    cancellationPolicy: {
      type: String,
      default: null
    },

    refundPolicy: {
      type: String,
      default: null
    },

    lateCheckoutFee: {
      lessThanOneHour: {
        type: Number,
        default: null
      },
      perHour: {
        type: Number,
        default: null
      }
    },

    // ==============================
    // NEW ADDITIONS
    // ==============================

    propertyTitle: {
      type: String,
      default: null,
      trim: true
    },

    officialSupportEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true
    },

    helpDeskContact: {
      type: String,
      default: null,
      trim: true
    },

    defaultCheckinTime: {
      type: String,
      default: "11:00"
    },

    defaultCheckoutTime: {
      type: String, 
      default: "11:00"
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);