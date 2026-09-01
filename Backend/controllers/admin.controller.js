const Staff = require("../models/staff.model");
const bcrypt = require("bcrypt");

// CONSUMED ---
// ==============================
// CREATE STAFF
// ==============================
exports.createStaff = async (req, res, next) => {

  try {

    const { name, email, password, role } = req.body;

    // validation
    if (!name || !email || !password || !role) {

      res.status(400);
      throw new Error("All fields are required");

    }

    // prevent admin creation
    if (role === "admin") {

      res.status(400);
      throw new Error("Cannot create admin");

    }

    // check existing staff
    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {

      res.status(400);
      throw new Error("Email already exists");

    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      msg: "Staff created successfully",
      staff
    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ==============================
// GET ALL STAFF
// ==============================

exports.getAllStaff = async (req, res, next) => {
  try {

    const staff = await Staff.find({
      role: { $ne: "admin" }
    }).select("-password");

    const updatedStaff = staff.map(s => ({
      ...s._doc,

      profileImage: s.profileImage
        ? (s.profileImage.startsWith("http")
            ? s.profileImage
            : `${process.env.BASE_URL}${s.profileImage}`)
        : null
    }));

    res.status(200).json({
      success: true,
      total: staff.length,
      staff: updatedStaff
    });

  } catch (error) {
    next(error);
  }
};


// CONSUMED ---
// ==============================
// UPDATE STAFF
// ==============================
exports.updateStaff = async (req, res, next) => {

  try {

    const { id } = req.params;

    const { name, email, role } = req.body;

    // prevent admin role assignment
    if (role === "admin") {

      res.status(400);
      throw new Error("Cannot assign admin role");

    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedStaff) {

      res.status(404);
      throw new Error("Staff not found");

    }

    res.status(200).json({
      success: true,
      msg: "Staff updated successfully",
      staff: updatedStaff
    });

  } catch (error) {

    next(error);

  }

};



// CONSUMED ---
// ==============================
// TOGGLE STAFF STATUS
// ==============================
exports.toggleStaffStatus = async (req, res, next) => {

  try {

    const { id } = req.params;

    const staff = await Staff.findById(id);

    if (!staff) {

      res.status(404);
      throw new Error("Staff not found");

    }

    // prevent admin status change
    if (staff.role === "admin") {

      res.status(400);
      throw new Error("Admin status cannot be changed");

    }

    // toggle active status
    staff.isActive = !staff.isActive;

    await staff.save();

    res.status(200).json({
      success: true,
      msg: `${staff.role} ${staff.name} is now ${staff.isActive ? "Active" : "Inactive"}`,
      staff
    });

  } catch (error) {

    next(error);

  }

};