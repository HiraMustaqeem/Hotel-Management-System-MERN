const mongoose = require("mongoose");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const guestSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "name is required"]
  },

  email: {
    type: String,
    unique: [true, "email should be unique"],
    required: [true, "email is required"],
    lowercase: true,
    trim: true,
    match: [emailRegex, "email should have valid syntax"]
  },

  // ======================================
  // PASSWORD
  // OPTIONAL FOR WALK-IN GUEST
  // ======================================
  password: {
    type: String,
    default: null,
    trim: true,
    minLength: 6
  },

contactNumber: {
  type: String,
  default: null,
  minlength: 11,
  maxlength: 11
},

  address: {
    type: String,
    default: null
  },

  profileImage: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  },

  preferences: {
    type: [String],
    default: []
  },

  // ======================================
  // EMAIL VERIFICATION
  // ======================================
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    default: "guest"
  },

  resetPasswordToken: String,
  
  resetPasswordExpire: Date,

  isPasswordSet: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema);