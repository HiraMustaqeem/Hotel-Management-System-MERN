const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(

  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true
    },

    roomType: {
      type: String,
      enum: ["single", "double", "suite", "deluxe"],
      required: [true, "Room type is required"]
    },

    price: {
      type: Number,
      required: [true, "Room price is required"]
    },

    capacity: {
      type: Number,
      required: [true, "Room capacity is required"]
    },

    status: {
      type: String,
      enum: [
        "available",
        "occupied",
        "cleaning",
        "maintenance"
      ],
      default: "available"
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    description: {
      type: String,
      default: null
    },

    roomImages: {
      type: [String],
      default: []
    }

  },

  { timestamps: true }

);

module.exports = mongoose.model("Room", roomSchema);