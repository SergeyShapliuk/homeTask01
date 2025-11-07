import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {authService} from "../../application/auth.service";


export async function createRefreshTokensHandler(
    req: RequestWithUserId<IdType>,
    res: Response
) {
    try {
        const userId = req.user?.id as string;
        const refreshToken = req.cookies.refreshToken;
        console.log("createRefreshTokensHandler", userId, refreshToken);
        if (!userId) return res.sendStatus(HttpStatus.Unauthorized);

        const result = await authService.refreshTokens(userId, refreshToken);

        // if (!result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
        // console.log({result});
        // const {accessToken, refreshToken} = result;

        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        // res.status(HttpStatus.Ok).send(accessToken);
    } catch (e) {
        errorsHandler(e, res);
    }
}
