const fs = require("fs");
const path = require("path");
const Room = require("../models/room.model");

// CONSUMED ---
// ==============================
// CREATE ROOM
// ==============================
exports.createRoom = async (req, res, next) => {

  try {

    const {
      roomNumber,
      roomType,
      price,
      capacity,
      description
    } = req.body;

    // ======================================================
    // VALIDATION
    // ======================================================
    if (!roomNumber || !roomType || !price || !capacity) {
      return res.status(400).json({
        success: false,
        msg: "All required fields must be provided"
      });
    }

    // ======================================================
    // CHECK DUPLICATE ROOM
    // ======================================================
    const existingRoom = await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        msg: "Room already exists"
      });
    }

    // ======================================================
    // HANDLE IMAGES (FROM MULTER)
    // ======================================================
    let images = [];

    if (req.files && req.files.length > 0) {

      if (req.files.length > 5) {
        return res.status(400).json({
          success: false,
          msg: "Maximum 5 images allowed"
        });
      }

      images = req.files.map(
        file => `/uploads/rooms/${file.filename}`
      );
    }

    // ======================================================
    // CREATE ROOM
    // ======================================================
    const room = await Room.create({
      roomNumber,
      roomType,
      price,
      capacity,
      description,
      roomImages: images
    });

    // ======================================================
    // RESPONSE
    // ======================================================
    res.status(201).json({
      success: true,
      msg: "Room created successfully",
      room
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// GET ALL ROOMS
// ==============================
exports.getAllRooms = async (req, res, next) => {

  try {

    const rooms = await Room.find();

    res.status(200).json({
      success: true,
      total: rooms.length,
      rooms
    });

  } catch (error) {

    next(error);

  }

};



// ==============================
// GET SINGLE ROOM
// ==============================
exports.getSingleRoom = async (req, res, next) => {

  try {

    const room = await Room.findById(req.params.id);

    if (!room) {

      res.status(404);
      throw new Error("Room not found");

    }

    res.status(200).json({
      success: true,
      room
    });

  } catch (error) {

    next(error);

  }

};


// CONSUMED ---
// ==============================
// DELETE ROOM (FULL)
// ==============================
exports.deleteRoom = async (req, res, next) => {

  try {

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });
    }

    // ======================================================
    // DELETE IMAGES FROM SERVER
    // ======================================================
    if (room.roomImages && room.roomImages.length > 0) {

      room.roomImages.forEach((img) => {

        const filePath = path.join(
          __dirname,
          "..",
          img
        );

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Image delete error:", err.message);
          }
        });

      });
    }

    // ======================================================
    // DELETE ROOM FROM DB
    // ======================================================
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: "Room deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// UPDATE ROOM
// ==============================
exports.updateRoom = async (req, res, next) => {

  try {

    // ======================================================
    // FIND ROOM
    // ======================================================
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });
    }

    // ======================================================
    // UPDATE TEXT FIELDS
    // ======================================================
    const {
      roomNumber,
      roomType,
      price,
      capacity,
      status,
      isAvailable,
      description
    } = req.body || {};

    if (roomNumber !== undefined)
      room.roomNumber = roomNumber;

    if (roomType !== undefined)
      room.roomType = roomType;

    if (price !== undefined)
      room.price = price;

    if (capacity !== undefined)
      room.capacity = capacity;

    if (status !== undefined)
      room.status = status;

    if (isAvailable !== undefined)
      room.isAvailable = isAvailable;

    if (description !== undefined)
      room.description = description;

    // ======================================================
    // UPDATE ROOM IMAGES (MERGE + VALIDATION)
    // ======================================================
    if (req.files && req.files.length > 0) {

      const newImages = req.files.map(
        file => `/uploads/rooms/${file.filename}`
      );

      // ======================================================
      // 1. CHECK DUPLICATES (NEW vs OLD)
      // ======================================================
      const existingImages = room.roomImages || [];

      const filteredNewImages = newImages.filter(
        img => !existingImages.includes(img)
      );

      // ======================================================
      // 2. TOTAL LIMIT CHECK (MAX 5)
      // ======================================================
      const totalImages =
        existingImages.length + filteredNewImages.length;

      if (totalImages > 5) {
        return res.status(400).json({
          success: false,
          msg: `Maximum 5 images allowed. Current: ${existingImages.length}, trying to add: ${filteredNewImages.length}`
        });
      }

      // ======================================================
      // 3. MERGE IMAGES
      // ======================================================
      room.roomImages = [
        ...existingImages,
        ...filteredNewImages
      ];
    }

    // ======================================================
    // 4. MINIMUM 1 IMAGE CHECK
    // ======================================================
    if (!room.roomImages || room.roomImages.length < 1) {
      return res.status(400).json({
        success: false,
        msg: "At least 1 image is required for a room"
      });
    }

    // ======================================================
    // SAVE ROOM
    // ======================================================
    await room.save();

    // ======================================================
    // RESPONSE
    // ======================================================
    res.status(200).json({
      success: true,
      msg: "Room updated successfully",
      room
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// DELETE SINGLE ROOM IMAGE
// ==============================
exports.deleteRoomImage = async (req, res, next) => {

  try {

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });
    }

    // ======================================================
    // IMAGE PATH
    // ======================================================
    const imageUrl =
      `/uploads/rooms/${req.params.imageName}`;

    // ======================================================
    // CHECK IMAGE EXISTS
    // ======================================================
    const imageExists =
      room.roomImages.includes(imageUrl);

    if (!imageExists) {
      return res.status(400).json({
        success: false,
        msg: "Image not found"
      });
    }

    // ======================================================
    // MINIMUM 1 IMAGE CHECK
    // ======================================================
    if (room.roomImages.length <= 1) {
      return res.status(400).json({
        success: false,
        msg: "Room must have at least 1 image"
      });
    }

    // ======================================================
    // REMOVE IMAGE FROM ARRAY
    // ======================================================
    room.roomImages = room.roomImages.filter(
      img => img !== imageUrl
    );

    // ======================================================
    // DELETE FILE FROM SERVER
    // ======================================================
    const filePath = path.join(
      __dirname,
      "..",
      imageUrl
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(
          "Image delete error:",
          err.message
        );
      }
    });

    await room.save();

    res.status(200).json({
      success: true,
      msg: "Image deleted successfully",
      room
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// UPDATE ROOM STATUS
// ==============================
exports.updateRoomStatus = async (req, res, next) => {

  try {

    const { status } = req.body;

    const allowedStatus = [
      "available",
      "occupied",
      "cleaning",
      "maintenance"
    ];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or missing status"
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isAvailable: status === "available"
      },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        msg: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      msg: "Room status updated successfully",
      room: updatedRoom
    });

  } catch (error) {
    next(error);
  }
};



// CONSUMED ---
// ==============================
// SEE ALL ROOMS
// ==============================
exports.allRooms = async (req, res, next) => {

  try {

    const rooms = await Room.find();

    res.status(200).json({
      success: true,
      total: rooms.length,
      rooms
    });

  } catch (error) {

    next(error);

  }}


  // ==============================
// GET AVAILABLE ROOMS
// ==============================
exports.getAvailableRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      status: "available",
      isAvailable: true
    }).select("roomNumber roomType status isAvailable");

    return res.status(200).json({
      success: true,
      rooms
    });

  } catch (error) {
    next(error);
  }
};



// ==============================
// GET CLEANING ROOMS
// ==============================
exports.getCleaningRooms = async (req, res, next) => {
  try {

    const rooms = await Room.find({
      status: "cleaning"
    }).select(
      "roomNumber roomType status isAvailable"
    );

    return res.status(200).json({
      success: true,
      rooms
    });

  } catch (error) {
    next(error);
  }
};