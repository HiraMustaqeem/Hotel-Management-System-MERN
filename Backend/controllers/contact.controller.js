const Contact = require("../models/contact.model");
const Guest = require("../models/guest.model");

exports.createContact = async (
    req,
    res
) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                msg: "Subject and message required"
            });
        }

        const contact = await Contact.create({
            guest: req.user.guestId,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            msg: "Message sent successfully",
            contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};





exports.getAllContacts = async (
    req,
    res
) => {
    try {

        const contacts =
            await Contact.find()
                .populate(
                    "guest",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            contacts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            msg: error.message
        });

    }
};



exports.deleteContact = async (
    req,
    res
) => {
    try {

        const contact =
            await Contact.findByIdAndDelete(
                req.params.id
            );

        if (!contact) {
            return res.status(404).json({
                success: false,
                msg: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Message deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            msg: error.message
        });

    }
};