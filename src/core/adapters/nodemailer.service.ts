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
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true для 465, false для 587
            auth: {
                user: "sergeshapluk@gmail.com",
                pass: process.env.PASS ?? "zbws jgqp nfdt jzzr"
            },
        });

        let info = await transporter.sendMail({
            from: "\"Kek 👻\" <sergeshapluk@gmail.com>",
            to: email,
            subject: "Your code is here",
            html: template(code) // html body
        });

        return !!info;
    }
};
