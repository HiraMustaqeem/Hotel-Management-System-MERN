const Room =
require("../models/room.model");

const Maintenance =
require("../models/maintenance.model");

// CONSUMED ---
// ==========================================
// HOUSEKEEPING MARK ROOM AVAILABLE
// ==========================================
exports.markRoomAvailable = async (
  req,
  res,
  next
) => {

  try {

    const room =
      await Room.findById(
        req.params.id
      );

    if (!room) {

      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });
    }

    if (
      room.status !== "cleaning"
    ) {

      return res.status(400).json({
        success: false,
        msg:
          "Only cleaning rooms can be marked available"
      });
    }

    room.status =
      "available";

    room.isAvailable =
      true;

    await room.save();

    res.status(200).json({

      success: true,

      msg:
        "Room marked available successfully",

      room

    });

  } catch (error) {

    next(error);

  }
};


// CONSUMED ---
// ======================================================
// GET CLEANING TASKS
// ======================================================
exports.getCleaningTasks = async (req, res, next) => {

  try {

    const cleaningTasks =
      await Room.find({
        status: "cleaning"
      })
      .select(
        "_id roomNumber status roomType"
      )
      .sort({
        roomNumber: 1
      });

    res.status(200).json({

      success: true,

      tasks: cleaningTasks

    });

  } catch (error) {

    next(error);

  }

};














