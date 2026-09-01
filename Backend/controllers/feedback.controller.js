const Feedback = require("../models/feedback.model");
const Guest = require("../models/guest.model");


// CONSUMED ---
// ======================================================
// CREATE FEEDBACK
// ======================================================
exports.createFeedback = async (req, res, next) => {

    try {

        const {
            feedback,
            rating
        } = req.body;

        // ======================================================
        // TOKEN CHECK
        // ======================================================

        const guestId = req.user.guestId;

        if (!guestId) {

            return res.status(403).json({
                success: false,
                msg: "Guest access only"
            });
        }

        // ======================================================
        // VALIDATION
        // ======================================================

        if (!feedback || !rating) {

            return res.status(400).json({
                success: false,
                msg: "Feedback and rating are required"
            });
        }

        // ======================================================
        // RATING VALIDATION
        // ======================================================

        if (rating < 1 || rating > 5) {

            return res.status(400).json({
                success: false,
                msg: "Rating must be between 1 to 5"
            });
        }

        // ======================================================
        // FIND LOGGED-IN GUEST
        // ======================================================

        const guest = await Guest.findById(guestId);

        if (!guest) {

            return res.status(404).json({
                success: false,
                msg: "Guest not found"
            });
        }

        // ======================================================
        // CREATE FEEDBACK
        // ======================================================

        const newFeedback = await Feedback.create({

            guest: guest._id,

            guestName: guest.name,

            guestEmail: guest.email,

            feedback,

            rating

        });

        // ======================================================
        // RESPONSE
        // ======================================================

        res.status(201).json({

            success: true,

            msg: "Feedback submitted successfully",

            feedback: newFeedback
        });

    } catch (error) {

        next(error);
    }
};


// CONSUMED ---
// ======================================================
// GET ALL FEEDBACKS (ADMIN ONLY)
// ======================================================
exports.getAllFeedbacks = async (req, res, next) => {

    try {

        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: feedbacks.length,

            feedbacks
        });

    } catch (error) {

        next(error);
    }
};


// CONSUMED ---
// ======================================================
// DELETE FEEDBACK (ADMIN ONLY)
// ======================================================

exports.deleteFeedback = async (req, res, next) => {

    try {

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {

            return res.status(404).json({
                success: false,
                msg: "Feedback not found"
            });
        }

        await feedback.deleteOne();

        res.status(200).json({

            success: true,

            msg: "Feedback deleted successfully"
        });

    } catch (error) {

        next(error);
    }
};


// CONSUMED ---
// ======================================================
//  ALL FEEDBACKS BY GUEST
// ======================================================
exports.allFeedbacks = async (req, res, next) => {

    try {

        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: feedbacks.length,

            feedbacks
        });

    } catch (error) {

        next(error);
    }
};
