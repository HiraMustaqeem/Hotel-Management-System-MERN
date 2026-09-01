const transporter = require("../config/mail.config");

const sendEmail = async (options) => {
 console.log("SEND EMAIL FUNCTION CALLED");
    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: options.email,

        subject: options.subject,

        html: options.message
    };

    await transporter.sendMail(mailOptions);
        console.log("MAIL SENT");

};

module.exports = sendEmail;