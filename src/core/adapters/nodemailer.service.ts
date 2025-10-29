import nodemailer from "nodemailer";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        if (process.env.NODE_ENV === "production") {
            console.log(`[PROD] Email simulation for tests: ${email} with code: ${code}`);
            return true;
        }
        console.log("email", email);
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sergeshapluk@gmail.com",
                pass: process.env.PASS_SMTP
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: true, // Log to console
            debug: true // Include SMTP traffic in the logs
        });

        let info = await transporter.sendMail({
            from: "\"Kek 👻\" <sergeshapluk@gmail.com>",
            to: email,
            subject: "Your code is here",
            html: template(code) // html body
        });
        console.log("info", !!info);
        return !!info;
    }
};
