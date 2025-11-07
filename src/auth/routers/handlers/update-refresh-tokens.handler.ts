import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {authService} from "../../application/auth.service";


export async function updateRefreshTokensHandler(
    req: RequestWithUserId<IdType>,
    res: Response
) {
    try {
        const userId = req.user?.id as string;
        const oldRefreshToken = req.cookies.refreshToken;

        console.log("updateRefreshTokensHandler", oldRefreshToken);
        if (!userId) return res.sendStatus(HttpStatus.Unauthorized);

        const tokens = await authService.refreshTokens(userId, oldRefreshToken);

        if (!tokens) return res.sendStatus(HttpStatus.Unauthorized);

        const {accessToken, refreshToken} = tokens;
        console.log("updateRefreshTokensHandler", refreshToken);
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        res.status(HttpStatus.Ok).send({accessToken});
    } catch (e) {
        errorsHandler(e, res);
    }
}
