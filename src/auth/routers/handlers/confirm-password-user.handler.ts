import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {authService} from "../../application/auth.service";


export async function confirmPasswordHandler(
    req: Request<{}, {}, { newPassword: string, recoveryCode: string }>,
    res: Response
) {
    try {
        const {newPassword, recoveryCode} = req.body;
        const refreshToken = req.cookies.refreshToken;
console.log({refreshToken})
console.log({newPassword})
console.log({recoveryCode})
        const result = await authService.confirmNewPasswordUser(newPassword, recoveryCode, refreshToken);

        if (!result) {
            return res.sendStatus(HttpStatus.BadRequest);
        }
        // const user = await usersRepository.findByConfirmationCode(recoveryCode);
        // console.log("confirmCodeHandlerUser", user);
        // if (!user) {
        //     return res.status(HttpStatus.BadRequest).json({
        //         errorsMessages: [
        //             {
        //                 message: "Invalid confirmation code",
        //                 field: "code"
        //             }
        //         ]
        //     });
        // }
        // if (user?.emailConfirmation && new Date(user.emailConfirmation.expirationDate) < new Date()) {
        //     return res.status(HttpStatus.BadRequest).json({
        //         errorsMessages: [
        //             {
        //                 message: "Confirmation code expired",
        //                 field: "code"
        //             }
        //         ]
        //     });
        // }
        // if (user?.emailConfirmation && user.emailConfirmation.isConfirmed) {
        //     return res.status(HttpStatus.BadRequest).json({
        //         errorsMessages: [
        //             {
        //                 message: "Email already confirmed",
        //                 field: "code"
        //             }
        //         ]
        //     });
        // }
        // if (!user._id) {
        //     console.error("User found but no _id:", user);
        //     return res.status(HttpStatus.InternalServerError).json({
        //         errorsMessages: [
        //             {
        //                 message: "Internal server error",
        //                 field: "code"
        //             }
        //         ]
        //     });
        // }
        // const response = await usersRepository.confirmEmail(user._id);
        // console.log("confirmEmail", response);
        res.status(HttpStatus.NoContent).send("Verify");
    } catch (e) {
        errorsHandler(e, res);
    }
}
