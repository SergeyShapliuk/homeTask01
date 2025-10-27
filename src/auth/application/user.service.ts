import {AuthAttributes} from "./dtos/auth-attributes";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {usersRepository} from "../../users/repositories/users.repository";
import {jwtService} from "../../core/adapters/jwt.service";


export const authService = {

    async loginUser(
        queryDto: AuthAttributes
    ): Promise<{ accessToken: string } | null> {
        const isCorrectCredentialsId = await this.checkUserCredentials(
            queryDto.loginOrEmail,
            queryDto.password
        );

        if (!isCorrectCredentialsId) {
            return null;
        }
        const accessToken = await jwtService.createToken(isCorrectCredentialsId);

        return {accessToken};
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
    }

};
