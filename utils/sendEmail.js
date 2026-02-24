import nodemailer from 'nodemailer'

const sendEmail = async ({ email, subject, message }) => {

    try {
        if (!email) {
            throw new Error("Recipient email is missing");
        }


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `happy code <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: message,
        });
    } catch (error) {
        console.log(error);

    }
};

export default sendEmail;