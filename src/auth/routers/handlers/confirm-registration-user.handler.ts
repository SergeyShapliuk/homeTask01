import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {usersRepository} from "../../../users/repositories/users.repository";


export async function confirmCodeHandler(
    req: Request<{}, {}, { code: string }>,
    res: Response
) {
    try {
        const {code} = req.body;
        const user = await usersRepository.findByConfirmationCode(code);
        console.log("confirmCodeHandlerUser", user);
        if (!user) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "Invalid confirmation code",
                        field: "code"
                    }
                ]
            });
        }
        if (user?.emailConfirmation && new Date(user.emailConfirmation.expirationDate) < new Date()) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "Confirmation code expired",
                        field: "code"
                    }
                ]
            });
        }
        if (user?.emailConfirmation && user.emailConfirmation.isConfirmed) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "Email already confirmed",
                        field: "code"
                    }
                ]
            });
        }
        if (!user._id) {
            console.error("User found but no _id:", user);
            return res.status(HttpStatus.InternalServerError).json({
                errorsMessages: [
                    {
                        message: "Internal server error",
                        field: "code"
                    }
                ]
            });
        }
        const response = await usersRepository.confirmEmail(user._id);
        console.log("confirmEmail",response);
        res.status(HttpStatus.NoContent).send("Verify");
    } catch (e) {
        errorsHandler(e, res);
    }
}
