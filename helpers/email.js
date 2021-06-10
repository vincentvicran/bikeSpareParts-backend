const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //* 1. CREATING A TRANSPORTER (host email sender)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        debug: true,
        logger: true,
    });

    //* 2. DEFINE THE EMAIL OPTIONS
    const mailOptions = {
        from: 'Bike Spare Parts Depo <info_bikespareparts@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    //* 3. FINALLY SENDING THE EMAIL
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
