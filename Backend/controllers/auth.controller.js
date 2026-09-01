// auth.controller.js

const Staff = require("../models/staff.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


// CONSUMED ---
// ==============================
// LOGIN STAFF
// ==============================
exports.login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required"
      });
    }

    // find staff
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({
        success: false,
        msg: "Staff not found"
      });
    }

    // 🔥 CHECK ACTIVE BEFORE LOGIN
    if (!staff.isActive) {
      return res.status(403).json({
        success: false,
        msg: "Account is deactivated. Contact admin."
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // generate token
    const token = jwt.sign(
      {
        staffId: staff._id,
        email: staff.email,
        role: staff.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      role: staff.role
    });

  } catch (error) {
    next(error);
  }
};



// ==============================
// LOGOUT STAFF
// ==============================
exports.logout = async (req, res, next) => {

  try {

    res.status(200).json({
      success: true,
      msg: "Logout successful"
    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ======================================================
// FORGOT PASSWORD (STAFF)
// ======================================================
exports.forgotPassword = async (req, res, next) => {

  try {

    const { email } = req.body;

    // ======================================================
    // CHECK STAFF
    // ======================================================

    const staff =
      await Staff.findOne({ email });

    if (!staff) {

      return res.status(404).json({
        success: false,
        msg: "Staff not found"
      });
    }

    // ======================================================
    // GENERATE RESET TOKEN
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

    staff.resetPasswordToken = hashedToken;

    staff.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await staff.save({ validateBeforeSave: false });
    // ======================================================
    // RESET URL
    // ======================================================

    const resetUrl =

      `http://localhost:3000/reset-password/${resetToken}`;

    // ======================================================
    // SEND EMAIL
    // ======================================================

    await sendEmail({

      email: staff.email,

      subject: "LuxuryStay Password Reset",

      message: `

            <h2>Password Reset</h2>

            <p>Click below link to reset password:</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>
            `
    });

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
// RESET PASSWORD (STAFF)
// ======================================================
exports.resetPassword = async (req, res, next) => {

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
    // FIND STAFF
    // ======================================================

    const staff =
      await Staff.findOne({

        resetPasswordToken: hashedToken,

        resetPasswordExpire: {
          $gt: Date.now()
        }
      });

    if (!staff) {

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

    staff.password = hashedPassword;

    staff.resetPasswordToken = undefined;

    staff.resetPasswordExpire = undefined;

    await staff.save({ validateBeforeSave: false });

    res.status(200).json({

      success: true,

      msg: "Password reset successful"
    });

  } catch (error) {

    next(error);
  }
};


// CONSUMED ---
// ======================================================
// CHANGE PASSWORD (STAFF)
// ======================================================

exports.changePassword = async (req, res, next) => {

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
    // FIND STAFF
    // ======================================================

    const staff =
      await Staff.findById(req.user.staffId);

    if (!staff) {

      return res.status(404).json({
        success: false,
        msg: "Staff not found"
      });
    }

    // ======================================================
    // CHECK OLD PASSWORD
    // ======================================================

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        staff.password
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

    staff.password = hashedPassword;

    await staff.save();

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