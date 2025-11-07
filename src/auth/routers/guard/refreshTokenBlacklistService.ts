import jwt from "jsonwebtoken";
import {Collection} from "mongodb";
import {tokenBlacklistCollection} from "../../../db/db";
import {jwtService} from "../../../core/adapters/jwt.service";

/**
 * Интерфейс документа в коллекции blacklist
 */
export interface BlacklistedToken {
    token: string;
    userId: string;
    expiresAt: Date; // Mongo TTL требует Date
}

/**
 * Добавить refresh токен в blacklist (например, при logout)
 */
export async function addToBlacklist(
    refreshToken: string,
    userId: string,
    collection: Collection<BlacklistedToken> = tokenBlacklistCollection
): Promise<void> {
    const decoded: any =await jwtService.decodeToken(refreshToken);
    if (!decoded?.exp) {
        throw new Error("❌ refreshToken не содержит exp (время истечения)");
    }
    console.log("addToBlacklist", decoded);
    const expiresAt = new Date(decoded.exp * 1000); // exp в секундах
    await collection.insertOne({token: refreshToken, userId, expiresAt});
    const addCollection=await collection.findOne({token: refreshToken})
    console.log('addCollection',addCollection)
}

/**
 * Проверка: находится ли токен в blacklist
 */
export async function isTokenBlacklisted(
    refreshToken: string,
    collection: Collection<BlacklistedToken> = tokenBlacklistCollection
): Promise<boolean> {
    const tokenDoc = await collection.findOne({token: refreshToken});
    console.log('isTokenBlacklisted',tokenDoc)
    return !!tokenDoc;
}

/**
 * Очистка всех токенов пользователя (например, при смене пароля)
 */
export async function blacklistAllUserTokens(
    userId: string,
    collection: Collection<BlacklistedToken> = tokenBlacklistCollection
): Promise<void> {
    await collection.deleteMany({userId});
}

/**
 * Инициализация TTL-индекса (чтобы Mongo удаляла expired токены)
 * Вызывается 1 раз при старте приложения в runDB()
 */
export async function ensureTTLIndex(
    collection: Collection<BlacklistedToken> = tokenBlacklistCollection
): Promise<void> {
    await collection.createIndex({expiresAt: 1}, {expireAfterSeconds: 0});
}
