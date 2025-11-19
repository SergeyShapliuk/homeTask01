import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../../core/adapters/jwt.service";
import {IdType} from "../../../core/types/id";

export const optionalAccessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        // Если нет токена - продолжаем без пользователя
        req.user = undefined;
        return next();
    }

    const [authType, token] = req.headers.authorization.split(' ');

    if (authType !== 'Bearer') {
        // Если не Bearer токен - продолжаем без пользователя
        req.user = undefined;
        return next();
    }

    try {
        const payload = await jwtService.verifyToken(token);
        if (payload && payload.userId) {
            req.user = { id: payload.userId } as IdType;
        } else {
            req.user = undefined;
        }
    } catch (error) {
        // Если токен невалидный - продолжаем без пользователя
        req.user = undefined;
    }

    next();
};
