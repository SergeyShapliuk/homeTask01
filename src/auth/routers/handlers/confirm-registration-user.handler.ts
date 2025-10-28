import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/user.service";


export async function confirmCodeHandler(
    req: Request,
    res: Response
) {
    try {
        const {code} = req.body;

        res.status(HttpStatus.NoContent).send('Verify');
    } catch (e) {
        errorsHandler(e, res);
    }
}
