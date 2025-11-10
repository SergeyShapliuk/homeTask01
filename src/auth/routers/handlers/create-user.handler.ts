import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/auth.service";
import {SessionDevice} from "../../../securityDevices/domain/sessionDevice";
import {jwtService} from "../../../core/adapters/jwt.service";


export async function loginUserHandler(
    req: Request<{}, {}, AuthAttributes>,
    res: Response
) {
    try {
        const {loginOrEmail, password} = req.body;
        const result = await authService.loginUser({loginOrEmail, password}, req);

        if (!result || !result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
        console.log({result});

        const {accessToken, refreshToken} = result;

        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        res.status(HttpStatus.Ok).send({accessToken});
    } catch (e) {
        errorsHandler(e, res);
    }
}

