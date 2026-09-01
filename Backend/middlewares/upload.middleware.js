const multer = require("multer");
const path = require("path");

// ======================================================
// STORAGE CONFIG
// ======================================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    // ======================================================
    // GUEST PROFILE IMAGES
    // ======================================================
    if (req.originalUrl.includes("guest")) {

      cb(null, "uploads/guests");
    }

    // ======================================================
    // STAFF PROFILE IMAGES
    // ======================================================
    else if (
      req.originalUrl.includes("staff")
    ) {

      cb(null, "uploads/staff");
    }

    // ======================================================
    // ROOM IMAGES
    // ======================================================
    else {

      cb(null, "uploads/rooms");
    }
  },

  // ======================================================
  // FILE NAME
  // ======================================================

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName +
      path.extname(file.originalname)
    );
  }
});

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {

    cb(null, true);

  } else {

    cb(
      new Error("Only image files allowed"),
      false
    );
  }
};

// ======================================================
// MULTER SETUP
// ======================================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    files: 5
  }
});

module.exports = upload;