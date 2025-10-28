import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/user.service";
import {nodemailerService} from "../../../core/adapters/nodemailer.service";
import {emailExamples} from "../../../core/adapters/emailExamples";
import {UserEntity} from "../../../users/domain/user.entity";


export async function resendCodeHandler(
    req: Request<{}, {}, { email: string }>,
    res: Response
) {
    try {
        const {email} = req.body;
        const newUser = new UserEntity("", email, "");
        nodemailerService
            .sendEmail(
                email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error("error in send email:", er));

        res.status(HttpStatus.NoContent).send("Resend code");
    } catch (e) {
        errorsHandler(e, res);
    }
}
