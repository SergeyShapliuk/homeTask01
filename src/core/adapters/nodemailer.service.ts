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
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: "sergeshaplyuk",
                pass: "onioijjbfqdikmnn" //?? "zbws jgqp nfdt jzzr"
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            },
            logger: true, // Log to console
            debug: true // Include SMTP traffic in the logs
        });

        let info = await transporter.sendMail({
            from: {name: "\"Kek 👻\"", address: "sergeshaplyuk@yandex.by"},
            to: email,
            subject: "Your code is here",
            html: template(code) // html body
        });
        console.log("info", !!info);
        return !!info;
    }
};
