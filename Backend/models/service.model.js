const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Service name is required"],
        unique: true,
        trim: true
    },

    price: {
        type: Number,
        required: [true, "Service price is required"]
    },

    description: {
        type: String,
        default: null
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);