import nodemailer from "nodemailer";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        console.log("email", email);
        let transporter = nodemailer.createTransport({
            service: "gmail",
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
