import {AuthAttributes} from "./dtos/auth-attributes";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {usersRepository} from "../../users/repositories/users.repository";


export const authService = {

    async loginUser(
        queryDto: AuthAttributes
    ): Promise<{ accessToken: string } | null> {
        const isCorrectCredentials = await this.checkUserCredentials(
            queryDto.loginOrEmail,
            queryDto.password
        );
        if (!isCorrectCredentials) {
            return null;
        }

        return {accessToken: "token"};
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        console.log("checkUserCredentials", user);
        if (!user) return false;

        return bcryptService.checkPassword(password, user.passwordHash ?? "");
    }

};
