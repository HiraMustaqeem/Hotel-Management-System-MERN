const Staff = require("../models/staff.model");
const fs = require("fs");
const path = require("path");

// CONSUMED ---
// ==============================
// GET MY PROFILE 
// ==============================
exports.getMyProfile = async (req, res, next) => {

  try {

    const staff = await Staff.findById(req.user.staffId)
      .select("-password");

    if (!staff) {

      return res.status(404).json({
        success: false,
        msg: "Staff not found"
      });

    }

    res.status(200).json({
      success: true,
      staff
    });

  } catch (error) {

    next(error);

  }

};



// CONSUMED ---
// ==============================
// UPDATE MY PROFILE
// ==============================
exports.updateMyProfile = async (req, res, next) => {

  try {

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
    // UPDATE TEXT FIELDS
    // ======================================================

    const {
      name,
      contactNumber,
      address
    } = req.body || {};

    if (name !== undefined)
      staff.name = name;

    if (contactNumber !== undefined)
      staff.contactNumber = contactNumber;

    if (address !== undefined)
      staff.address = address;

    // ======================================================
    // UPDATE PROFILE IMAGE
    // ======================================================

    if (req.file) {

      // delete old image
      if (staff.profileImage) {

        const oldImagePath = path.join(
          __dirname,
          "..",
          staff.profileImage
        );

        fs.unlink(oldImagePath, (err) => {

          if (err) {

            console.log(
              "Old image delete error:",
              err.message
            );
          }
        });
      }

      // save new image
      staff.profileImage =
        `/uploads/staff/${req.file.filename}`;
    }

    // ======================================================
    // SAVE
    // ======================================================

    await staff.save();

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Profile updated successfully",

      staff

    });

  } catch (error) {

    next(error);

  }

};



// CONSUMED ---
// ==============================
// REMOVE PROFILE IMAGE
// ==============================
exports.deleteProfileImage = async (req, res, next) => {

  try {

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
    // CHECK IMAGE EXISTS
    // ======================================================

    if (!staff.profileImage) {

      return res.status(400).json({
        success: false,
        msg: "No profile image found"
      });
    }

    // ======================================================
    // DELETE IMAGE FROM SERVER
    // ======================================================

    const imagePath = path.join(
      __dirname,
      "..",
      staff.profileImage
    );

    fs.unlink(imagePath, (err) => {

      if (err) {

        console.log(
          "Image delete error:",
          err.message
        );
      }
    });

    // ======================================================
    // REMOVE FROM DATABASE
    // ======================================================

    staff.profileImage = "";
// https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
    await staff.save();

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({

      success: true,

      msg: "Profile image deleted successfully"

    });

  } catch (error) {

    next(error);

  }

};