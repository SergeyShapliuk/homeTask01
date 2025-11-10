import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {addToBlacklist, isTokenBlacklisted} from "../guard/refreshTokenBlacklistService";
import {jwtService} from "../../../core/adapters/jwt.service";
import {sessionsRepository} from "../../../securityDevices/repositories/sessions.repository";


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
        // 2. Декодируем токен и проверяем устройство в БД
        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload?.deviceId) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        // 3. ✅ ВАЖНО: Проверяем существование устройства в БД
        const device = await sessionsRepository.findByDeviceId(payload.deviceId);
        if (!device || device.userId !== userId) {
            return res.sendStatus(HttpStatus.Unauthorized); // 401 если устройство удалено
        }

        await sessionsRepository.deleteByDeviceId(payload.deviceId);
        console.log(`Device ${payload.deviceId} deleted during logout`);


        await addToBlacklist(refreshToken, userId);
        // if (!result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
        // console.log({result});
        // const {accessToken, refreshToken} = result;
        res.clearCookie("refreshToken");
        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}
