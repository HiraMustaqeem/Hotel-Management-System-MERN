const express = require("express");
const cors = require("cors");

const app = express();

// ======================================================
// CORS
// ======================================================

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ======================================================
// STATIC FOLDER
// ======================================================

app.use(
    "/uploads",
    express.static("uploads")
);


// ======================================================
// ROUTES
// ======================================================

app.use(
    "/api/auth",
    require("./routes/auth.routes")
);

app.use(
    "/api/admin",
    require("./routes/admin.routes")
);

app.use(
    "/api/guest",
    require("./routes/guest.routes")
);

app.use(
    "/api/staff",
    require("./routes/staff.routes")
);

app.use(
    "/api/room",
    require("./routes/room.routes")
);

app.use(
    "/api/booking",
    require("./routes/booking.routes")
);

app.use(
    "/api/service",
    require("./routes/service.routes")
);

app.use(
    "/api/settings",
    require("./routes/systemSettings.routes")
);

app.use(
    "/api/billing",
    require("./routes/billing.routes")
);

app.use(
    "/api/feedback",
    require("./routes/feedback.routes")
);

app.use(
    "/api/maintenance",
    require("./routes/maintenance.routes")
);

app.use(
    "/api/housekeeping",
    require("./routes/housekeeping.routes")
);

app.use(
    "/api/reports",
    require("./routes/report.routes")
);

app.use(
    "/api/dashboard",
    require("./routes/dashboard.routes")
);

app.use(
  "/api/contact",
  require("./routes/contact.routes")
);

// ======================================================
// ERROR HANDLER
// ======================================================

const errorHandler =
    require("./middlewares/errorHandler.middleware");

app.use(errorHandler);


// ======================================================
// EXPORT
// ======================================================

module.exports = app;
