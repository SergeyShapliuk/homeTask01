import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/auth.service";
import {nodemailerService} from "../../../core/adapters/nodemailer.service";
import {emailExamples} from "../../../core/adapters/emailExamples";
import {UserEntity} from "../../../users/domain/user.entity";
import {usersRepository} from "../../../users/repositories/users.repository";
import {randomUUID} from "crypto";


export async function resendCodeHandler(
    req: Request<{}, {}, { email: string }>,
    res: Response
) {
    try {
        const {email} = req.body;
        const existingUser = await usersRepository.findByLoginOrEmail(email);
        // ✅ Если пользователь не найден
        if (!existingUser) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "User with this email not found",
                        field: "email"
                    }
                ]
            });
        }

        // ✅ Если email уже подтвержден
        if (existingUser?.emailConfirmation && existingUser.emailConfirmation.isConfirmed) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "Email already confirmed",
                        field: "email"
                    }
                ]
            });
        }
        // ✅ Генерируем новый код подтверждения
        const newConfirmationCode = randomUUID();
        const newExpirationDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        // ✅ Обновляем код в базе данных
        const updated = await usersRepository.updateConfirmationCode(
            existingUser._id,
            newConfirmationCode,
            newExpirationDate
        );
        if (!updated) {
            return res.status(HttpStatus.InternalServerError).json({
                errorsMessages: [
                    {
                        message: "Failed to update confirmation code",
                        field: "email"
                    }
                ]
            });
        }
        nodemailerService
            .sendEmail(
                email,
                newConfirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error("error in send email:", er));

        res.status(HttpStatus.NoContent).send("Resend code");
    } catch (e) {
        errorsHandler(e, res);
    }
}
