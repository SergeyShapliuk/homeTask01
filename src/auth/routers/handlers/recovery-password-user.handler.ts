import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {authService} from "../../application/auth.service";


export async function recoveryPasswordUserHandler(
    req: Request<{}, {}, { email: string }>,
    res: Response
) {
    try {
        const {email} = req.body;
        await authService.recoveryPasswordUser(email);

        return res.sendStatus(HttpStatus.NoContent);

    } catch (e) {
        errorsHandler(e, res);
    }
}
