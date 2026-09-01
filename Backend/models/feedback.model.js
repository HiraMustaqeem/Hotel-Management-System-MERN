const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({

    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true
    },

    guestName: {
        type: String,
        required: true
    },

    guestEmail: {
        type: String,
        required: true
    },

    feedback: {
        type: String,
        required: true,
        trim: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }

}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);