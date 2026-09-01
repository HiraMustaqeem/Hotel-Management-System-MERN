const Service = require("../models/service.model");


// CONSUMED ---
// ==============================
// CREATE SERVICE (ADMIN ONLY)
// ==============================
exports.createService = async (req, res, next) => {

    try {

        const { name, price, description } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                msg: "Name and price are required"
            });
        }

        const existing = await Service.findOne({ name });

        if (existing) {
            return res.status(400).json({
                success: false,
                msg: "Service already exists"
            });
        }

        const service = await Service.create({
            name,
            price,
            description
        });

        res.status(201).json({
            success: true,
            msg: "Service created successfully",
            service
        });

    } catch (error) {
        next(error);
    }
};



// CONSUMED ---
// ==============================
// GET ALL SERVICES
// ==============================
exports.getAllServices = async (req, res, next) => {

    try {

        const services = await Service.find();

        res.status(200).json({
            success: true,
            services
        });

    } catch (error) {
        next(error);
    }
};



// CONSUMED ---
// ==============================
// UPDATE SERVICE
// ==============================
exports.updateService = async (req, res, next) => {

    try {

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after" }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Service updated successfully",
            service
        });

    } catch (error) {
        next(error);
    }
};



// CONSUMED ---
// ==============================
// DELETE SERVICE
// ==============================
exports.deleteService = async (req, res, next) => {

    try {

        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Service deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};