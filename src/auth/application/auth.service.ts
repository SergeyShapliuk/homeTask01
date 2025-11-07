import {AuthAttributes} from "./dtos/auth-attributes";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {usersRepository} from "../../users/repositories/users.repository";
import {jwtService} from "../../core/adapters/jwt.service";
import {nodemailerService} from "../../core/adapters/nodemailer.service";
import {emailExamples} from "../../core/adapters/emailExamples";
import {UserEntity} from "../../users/domain/user.entity";
import {addToBlacklist} from "../routers/guard/refreshTokenBlacklistService";


export const authService = {

    async loginUser(
        queryDto: AuthAttributes
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

        return {accessToken, refreshToken};
    },

    async refreshTokens(
        userId: string, oldRefreshToken: string
    ): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await usersRepository.findById(userId);

        if (!user?._id) {
            return null;
        }
        await addToBlacklist(oldRefreshToken, userId);
        const accessToken = await jwtService.createToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId);
        if (!accessToken || !refreshToken) {
            return null;
        }

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
    }

};
