import {AuthAttributes} from "./dtos/auth-attributes";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {usersRepository} from "../../users/repositories/users.repository";
import {jwtService} from "../../core/adapters/jwt.service";
import {nodemailerService} from "../../core/adapters/nodemailer.service";
import {emailExamples} from "../../core/adapters/emailExamples";
import {UserEntity} from "../../users/domain/user.entity";
import {addToBlacklist} from "../routers/guard/refreshTokenBlacklistService";
import {SessionDevice} from "../../securityDevices/domain/sessionDevice";
import {Request} from "express";
import {sessionsRepository} from "../../securityDevices/repositories/sessions.repository";
import {passwordResetService} from "../../core/adapters/passwordResetService";
import {ObjectId} from "mongodb";


export const authService = {

    async loginUser(
        queryDto: AuthAttributes,
        req: Request
    ): Promise<{ accessToken: string, refreshToken: string } | null> {
        const isCorrectCredentialsId = await this.checkUserCredentials(
            queryDto.loginOrEmail,
            queryDto.password
        );

        if (!isCorrectCredentialsId) {
            return null;
        }
        const accessToken = await jwtService.createToken(isCorrectCredentialsId);
        const refreshToken = await jwtService.createRefreshToken(isCorrectCredentialsId);

        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload?.deviceId) return null;


        const sessionData: SessionDevice = {
            deviceId: payload.deviceId,
            userId: payload.userId,
            ip: req.ip ?? "unknown",
            title: this.getDeviceTitle(req),
            lastActiveDate: new Date(payload.iat * 1000),
            expiresAt: new Date(payload.exp * 1000),
            createdAt: new Date()
        };
        await sessionsRepository.create(sessionData);

        return {accessToken, refreshToken};
    },

    async refreshTokens(
        userId: string, oldRefreshToken: string
    ): Promise<{ accessToken: string, refreshToken: string } | null> {
        const oldPayload = await jwtService.decodeToken(oldRefreshToken) as any;
        if (!oldPayload?.deviceId) {
            return null;
        }

        // Проверяем существование устройства в БД
        const existingSession = await sessionsRepository.findByDeviceId(oldPayload.deviceId);
        if (!existingSession || existingSession.userId !== userId) {
            return null;
        }
        const user = await usersRepository.findById(userId);

        if (!user?._id) {
            return null;
        }
        await addToBlacklist(oldRefreshToken, userId);
        const accessToken = await jwtService.createToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, oldPayload.deviceId);
        if (!accessToken || !refreshToken) {
            return null;
        }
        const newPayload = await jwtService.decodeToken(refreshToken);
        if (!newPayload?.iat || !newPayload?.exp) {
            return null;
        }
        await sessionsRepository.updateSession(oldPayload.deviceId, {
            lastActiveDate: new Date(newPayload.iat * 1000), // обновляем дату активности
            expiresAt: new Date(newPayload.exp * 1000)       // обновляем срок действия
            // deviceId и userId остаются прежними
        });

        return {accessToken, refreshToken};
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<string | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        console.log("checkUserCredentials", user);
        if (!user) return null;
        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash ?? "");
        if (!isPassCorrect) {
            return null;
        }


        return user._id.toString() ?? null;
    },

    async registerUser(
        login: string,
        password: string,
        email: string
    ): Promise<{ user: UserEntity | null, duplicateField?: "login" | "email" }> {
        const existenceCheck = await usersRepository.doesExistByLoginOrEmail(login, email);
        if (existenceCheck.exists) {
            return {
                user: null,
                duplicateField: existenceCheck.field
            };
        }
        const passwordHash = await bcryptService.generateHash(password);
        const newUser = new UserEntity(login, email, passwordHash);


        await usersRepository.create(newUser);

        console.log("newUser.emailConfirmation.confirmationCode", newUser.emailConfirmation.confirmationCode);
        nodemailerService
            .sendEmail(
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error("error in send email:", er));

        return {user: newUser};
    },

    async recoveryPasswordUser(
        email: string
    ): Promise<boolean> {
        // const existenceCheck = await usersRepository.doesExistByEmail(email);
        // if (existenceCheck.exists) {
        //     return {
        //         user: null,
        //         duplicateField: existenceCheck.field
        //     };
        // }

        const confirmationCode = await passwordResetService.createResetCode(email);

        console.log("confirmationCode", confirmationCode);

        nodemailerService
            .sendEmail(
                email,
                confirmationCode,
                emailExamples.passwordRecoveryEmail
            )
            .catch(er => console.error("error in send email:", er));

        return true;
    },

    async confirmNewPasswordUser(
        newPassword: string,
        recoveryCode: string,
    ): Promise<boolean | null> {
        const email = await passwordResetService.getEmailByCode(recoveryCode);
        if (!email) {
            return null;
        }
        const user = await usersRepository.findByLoginOrEmail(email);
console.log({user})
//         if (!payload.userId) {
//             return null;
//         }
//         const user = await usersRepository.findById(payload.userId);
        console.log({user});
        if (!user?._id) {
            return null;
        }
        const verify = await passwordResetService.verifyCode(user.email, recoveryCode);

        if (!verify) {
            return null;
        }

        const newPasswordHash = await bcryptService.generateHash(newPassword);
        const update = await usersRepository.updateUserPassword(user._id, newPasswordHash);


        return update;
    },

    getDeviceTitle(req: Request): string {
        const agent = req.headers["user-agent"];
        return agent ? agent.split(" ")[0] : "Unknown device";
    }

};
