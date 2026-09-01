const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["admin", "manager", "receptionist", "housekeeping"],
      required: true
    },

    // profile image
    profileImage: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    },

    // contact number
    contactNumber: {
      type: String,
      default: null
    },

    // address
    address: {
      type: String,
      default: null
    },

    // active/inactive
    isActive: {
      type: Boolean,
      default: true
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);