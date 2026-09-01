const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(

    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        reportedByGuest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guest",
            default: null
        },

        reportedByStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            default: null
        },

        issue: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "in_progress",
                "resolved"
            ],
            default: "pending"
        }

    },

    { timestamps: true }

);

module.exports =
mongoose.model(
    "Maintenance",
    maintenanceSchema
);