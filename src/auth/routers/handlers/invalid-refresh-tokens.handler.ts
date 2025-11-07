import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {authService} from "../../application/auth.service";
import {addToBlacklist, isTokenBlacklisted} from "../guard/refreshTokenBlacklistService";


export async function invalidRefreshTokensHandler(
    req: RequestWithUserId<IdType>,
    res: Response
) {
    try {
        const userId = req.user?.id as string;
        const refreshToken = req.cookies.refreshToken;
        console.log("invalidRefreshTokensHandler", userId, refreshToken);

        if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
        const isBlackListed = await isTokenBlacklisted(refreshToken);
        console.log("isBlackListed", isBlackListed);
        if (isBlackListed) return res.sendStatus(HttpStatus.Unauthorized);
        await addToBlacklist(refreshToken, userId);
        // if (!result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
        // console.log({result});
        // const {accessToken, refreshToken} = result;

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}
