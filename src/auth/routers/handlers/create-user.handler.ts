import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/user.service";


export async function loginUserHandler(
    req: Request<{}, {}, AuthAttributes>,
    res: Response
) {
    try {
        const {loginOrEmail, password} = req.body;
        const accessToken = await authService.loginUser({loginOrEmail, password});

        if (!accessToken) return res.sendStatus(HttpStatus.Unauthorized);
        console.log(accessToken)
        res.status(HttpStatus.Ok).send(accessToken);
    } catch (e) {
        errorsHandler(e, res);
    }
}
