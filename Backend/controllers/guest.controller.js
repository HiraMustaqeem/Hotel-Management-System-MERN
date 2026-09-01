const Guest = require("../models/guest.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const path = require("path");
const Room = require("../models/room.model");
const Booking = require("../models/booking.model");


// CONSUMED ---
// ==============================
// REGISTER GUEST
// ==============================
exports.registerGuest = async (req, res, next) => {

  try {

    const {
      name,
      email,
      password,
      contactNumber
    } = req.body;

    // validation
    if (!name || !email || !password || !contactNumber) {

      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });

    }

    // ======================================================
    // CONTACT NUMBER VALIDATION
    // ======================================================

    if (contactNumber.length !== 11) {

      return res.status(400).json({
        success: false,
        msg: "Contact number must be 11 digits"
      });
    }

    // check existing guest
    const existingGuest =
      await Guest.findOne({ email });

    if (existingGuest) {

      return res.status(400).json({
        success: false,
        msg: "Email already exists"
      });

    }

    // hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // create guest
    const guest = await Guest.create({

      name,

      email,

      password: hashedPassword,

      contactNumber

    });

    res.status(201).json({

      success: true,

      msg: "Guest registered successfully",

      guest

    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ==============================
// LOGIN GUEST
// ==============================
exports.loginGuest = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {

      res.status(400);
      throw new Error("Email and password are required");
    }

    // check guest
    const guest = await Guest.findOne({ email });

    if (!guest) {

      res.status(404);
      throw new Error("Guest not found");

    }

    // compare password
    const isMatch = await bcrypt.compare(password, guest.password);

    if (!isMatch) {

      res.status(400);
      throw new Error("Invalid credentials");
    }

    // generate token
    const token = jwt.sign(
      {
        guestId: guest._id,
        email: guest.email,
        role: guest.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      role: guest.role
    });

  } catch (error) {
    next(error);
  }

};


// CONSUMED ---
// ==============================
// LOGOUT GUEST
// ==============================
exports.logoutGuest = async (req, res, next) => {

  try {

    res.status(200).json({
      success: true,
      msg: "Guest logout successful"
    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ==============================
// GET GUEST PROFILE
// ==============================
exports.getMyProfile = async (req, res, next) => {

  try {

    const guest =
      await Guest.findById(req.user.guestId)
        .select("-password");

    if (!guest) {
      return res.status(404).json({
        success: false,
        msg: "Guest not found"
      });
    }

    res.status(200).json({
      success: true,
      guest
    });

  } catch (error) {
    next(error);
  }
};


// CONSUMED ---
// ==============================
// UPDATE GUEST PROFILE
// ==============================
exports.updateMyProfile = async (req, res, next) => {

  try {

    const guest =
      await Guest.findById(req.user.guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        msg: "Guest not found"
      });
    }

    const {
      name,
      contactNumber,
      address,
      preferences
    } = req.body || {};

    // ======================================================
    // UPDATE TEXT FIELDS
    // ======================================================

    if (name !== undefined)
      guest.name = name;

    if (address !== undefined)
      guest.address = address;

    if (preferences !== undefined)
      guest.preferences = preferences;

    // ======================================================
    // CONTACT NUMBER VALIDATION
    // ======================================================

    if (contactNumber !== undefined) {

      if (contactNumber.length !== 11) {
        return res.status(400).json({
          success: false,
          msg: "Contact number must be 11 digits"
        });
      }

      guest.contactNumber = contactNumber;
    }

    // ======================================================
    // PROFILE IMAGE UPDATE
    // ======================================================

    if (req.file) {

      // delete old image
      if (guest.profileImage) {

        const oldImagePath = path.join(
          __dirname,
          "..",
          guest.profileImage
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.log(
              "Old profile image delete error:",
              err.message
            );
          }
        });
      }

      // set new image
      guest.profileImage =
        `/uploads/guests/${req.file.filename}`;
    }

    // ======================================================
    // SAVE
    // ======================================================

    await guest.save();

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      guest
    });

  } catch (error) {
    next(error);
  }
};




// CONSUMED ---
// ==============================
// REMOVE GUEST PROFILE IMAGE
// ==============================
exports.removeProfileImage = async (req, res, next) => {

  try {

    const guest =
      await Guest.findById(req.user.guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        msg: "Guest not found"
      });
    }

    if (!guest.profileImage) {
      return res.status(400).json({
        success: false,
        msg: "No profile image found"
      });
    }

    // delete image from uploads
    const filePath = path.join(
      __dirname,
      "..",
      guest.profileImage
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(
          "Profile image delete error:",
          err.message
        );
      }
    });

    guest.profileImage = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    await guest.save();

    res.status(200).json({
      success: true,
      msg: "Profile image removed successfully",
      guest
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// CREATE/BOOK WALK-IN GUEST 
// ==============================
exports.createWalkinGuest = async (req, res, next) => {

  try {

    const {
      name,
      email,
      contactNumber,
      preferences,
      room,
      checkInDate,
      checkOutDate,
      services
    } = req.body;

    const staffId = req.user.staffId;

    // ======================================================
    // VALIDATION
    // ======================================================

    if (
      !name ||
      !email ||
      !room ||
      !checkInDate ||
      !checkOutDate
    ) {

      return res.status(400).json({
        success: false,
        msg: "Required fields are missing"
      });

    }

    // ======================================================
    // CHECK ROOM EXISTS
    // ======================================================

    const roomData = await Room.findById(room);

    if (!roomData) {

      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });

    }

    // ======================================================
    // ROOM AVAILABILITY
    // ======================================================

    if (roomData.status !== "available") {

      return res.status(400).json({
        success: false,
        msg: "Room is not available"
      });

    }

    // ======================================================
    // DATE VALIDATION
    // ======================================================

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    const today = new Date();

    today.setHours(0,0,0,0);

    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    if (start < today) {

      return res.status(400).json({
        success: false,
        msg: "Check-in date cannot be in past"
      });

    }

    if (end <= start) {

      return res.status(400).json({
        success: false,
        msg: "Invalid checkout date"
      });

    }

    // ======================================================
    // CHECK OVERLAPPING BOOKINGS
    // ======================================================

    const overlappingBooking = await Booking.findOne({

      room,

      status: {
        $ne: "cancelled"
      },

      $or: [
        {
          checkInDate: { $lt: end },
          checkOutDate: { $gt: start }
        }
      ]

    });

    if (overlappingBooking) {

      return res.status(400).json({
        success: false,
        msg: "Room already booked for selected dates"
      });

    }

    // ======================================================
    // FIND OR CREATE GUEST
    // ======================================================

    let guest = await Guest.findOne({ email });

    let isNewGuest = false;

    if (!guest) {

      guest = await Guest.create({

        name,
        email,
        contactNumber: contactNumber || null,
        preferences: preferences || [],
        password: null,
        role: "guest"

      });

      // 1
console.log("New walk-in guest created:", guest._id);
      isNewGuest = true;

      // ======================================================
      // GENERATE RESET TOKEN
      // ======================================================

      const token = crypto.randomBytes(32).toString("hex");

      guest.resetPasswordToken = token;

      guest.resetPasswordExpire =
        Date.now() + 1000 * 60 * 30;

      await guest.save();

      // 3
console.log("Reset token generated for walk-in guest:", token);
      // ======================================================
      // SEND EMAIL
      // ======================================================
console.log("Sending account setup email to walk-in guest:", guest.email);
      await sendEmail({

        email: guest.email,

        subject:
          "Complete Your LuxuryStay Account Setup",

        message: `
          <h2>Welcome to LuxuryStay</h2>

          <p>Your walk-in guest account has been created successfully.</p>

          <p>Click below to set your password:</p>

          <a href="${process.env.FRONTEND_URL}/set-password/${token}">
            Set Password
          </a>

          <p>This link will expire in 30 minutes.</p>
        `
      });

    }
    // 4
    console.log("Email sent:", guest.email);

    // ======================================================
    // CALCULATE TOTAL
    // ======================================================

    const diffTime =
      end.getTime() - start.getTime();

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    const roomPrice =
      diffDays * Number(roomData.price);

    const servicesTotal = (services || []).reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const totalPrice =
      roomPrice + servicesTotal;

    // ======================================================
    // CREATE BOOKING
    // ======================================================

    const booking = await Booking.create({

      guest: guest._id,

      room,

      staff: staffId,

      checkInDate: start,

      checkOutDate: end,

      totalPrice,

      status: "confirmed",

      // preferences: preferences || [],

      services: services || []

    });

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(201).json({

      success: true,

      msg: isNewGuest
        ? "Walk-in guest and booking created successfully"
        : "Booking created for existing guest",

      booking,
      guest

    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ======================================================
// SEND EMAIL 
// ======================================================
exports.testEmail = async (req, res, next) => {

  try {

    await sendEmail({

      email: "hiramustaqeem09@gmail.com",

      subject: "LuxuryStay Test Email",

      message: `
                <h1>Email Working Successfully</h1>
                <p>Your HMS mail setup is complete.</p>
            `
    });

    res.status(200).json({
      success: true,
      msg: "Email sent successfully"
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ======================================================
// SET WALK-IN GUEST PASSWORD
// ======================================================
exports.setPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const guest = await Guest.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!guest) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    guest.password = hashedPassword;
    guest.resetPasswordToken = undefined;
    guest.resetPasswordExpire = undefined;
    guest.isEmailVerified = true;

    await guest.save();

    res.status(200).json({
      success: true,
      msg: "Password set successfully. You can now login."
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ======================================================
// FORGOT PASSWORD (GUEST)
// ======================================================
exports.forgotPasswordGuest = async (req, res, next) => {

  try {

    const { email } = req.body;

    // ======================================================
    // FIND GUEST
    // ======================================================

    const guest = await Guest.findOne({ email });

    if (!guest) {

      return res.status(404).json({
        success: false,
        msg: "Guest not found"
      });
    }

    // ======================================================
    // PASSWORD EXISTS CHECK
    // ======================================================

    if (!guest.password) {

      return res.status(400).json({
        success: false,
        msg: "Password is not set for this guest account"
      });
    }

    // ======================================================
    // GENERATE TOKEN
    // ======================================================

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    // ======================================================
    // HASH TOKEN
    // ======================================================

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // ======================================================
    // SAVE TOKEN
    // ======================================================

    guest.resetPasswordToken = hashedToken;

    guest.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await guest.save({
      validateBeforeSave: false
    });

    // ======================================================
    // RESET URL
    // ======================================================

    const resetUrl =

`${process.env.FRONTEND_URL}/guest-reset-password/${resetToken}`;
    // ======================================================
    // SEND EMAIL
    // ======================================================

    await sendEmail({

      email: guest.email,

      subject: "LuxuryStay Guest Password Reset",

      message: `

            <h2>Password Reset</h2>

            <p>Click below link to reset your password:</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>
            `
    });

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Reset password email sent"
    });

  } catch (error) {

    next(error);
  }
};



// CONSUMED ---
// ======================================================
// RESET PASSWORD (GUEST)
// ======================================================
exports.resetPasswordGuest = async (req, res, next) => {

  try {

    const { password } = req.body;

    // ======================================================
    // HASH TOKEN
    // ======================================================

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // ======================================================
    // FIND GUEST
    // ======================================================

    const guest = await Guest.findOne({

      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: Date.now()
      }
    });

    if (!guest) {

      return res.status(400).json({
        success: false,
        msg: "Invalid or expired token"
      });
    }

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ======================================================
    // UPDATE PASSWORD
    // ======================================================

    guest.password = hashedPassword;

    guest.resetPasswordToken = undefined;

    guest.resetPasswordExpire = undefined;

    await guest.save({
      validateBeforeSave: false
    });

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Guest password reset successful"
    });

  } catch (error) {

    next(error);
  }
};



// CONSUMED ---
// ======================================================
// CHANGE PASSWORD (GUEST)
// ======================================================
exports.changeGuestPassword = async (req, res, next) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!oldPassword || !newPassword) {

      return res.status(400).json({
        success: false,
        msg: "Old password and new password are required"
      });
    }

    // ======================================================
    // FIND GUEST
    // ======================================================

    const guest =
      await Guest.findById(req.user.guestId);

    if (!guest) {

      return res.status(404).json({
        success: false,
        msg: "Guest not found"
      });
    }

    // ======================================================
    // PASSWORD EXISTS CHECK
    // ======================================================

    if (!guest.password) {

      return res.status(400).json({
        success: false,
        msg: "Password is not set for this account"
      });
    }

    // ======================================================
    // CHECK OLD PASSWORD
    // ======================================================

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        guest.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        msg: "Old password is incorrect"
      });
    }

    // ======================================================
    // HASH NEW PASSWORD
    // ======================================================

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // ======================================================
    // UPDATE PASSWORD
    // ======================================================

    guest.password = hashedPassword;

    await guest.save();

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Password changed successfully"

    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ======================================================
// GET ALL GUESTS (ADMIN / MANAGER / RECEPTIONIST)
// ======================================================
exports.getAllGuests = async (req, res, next) => {

    try {

        const guests = await Guest.find({})
            .select("name email address contactNumber preferences")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: guests.length,
            guests
        });

    } catch (error) {
        next(error);
    }
};