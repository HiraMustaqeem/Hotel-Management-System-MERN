const SystemSettings = require("../models/systemSettings.model");


// CONSUMED ---
// ======================================================
// GET SETTINGS (ADMIN)
// ======================================================
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await SystemSettings.findOne();

    res.status(200).json({
      success: true,
      settings
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ======================================================
// CREATE / UPDATE SETTINGS
// ======================================================
exports.updateSettings = async (req, res, next) => {
  try {

    const updateData = req.body;

    let settings = await SystemSettings.findOne();

    // IF EXISTS → UPDATE
    if (settings) {

      settings = await SystemSettings.findByIdAndUpdate(
        settings._id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    } 
    // IF NOT EXISTS → CREATE
    else {
      settings = await SystemSettings.create(updateData);
    }

    res.status(200).json({
      success: true,
      msg: "Settings saved successfully",
      settings
    });

  } catch (error) {
    next(error);
  }
};