import {AuthAttributes} from "./dtos/auth-attributes";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {usersRepository} from "../../users/repositories/users.repository";
import {jwtService} from "../../core/adapters/jwt.service";
import {nodemailerService} from "../../core/adapters/nodemailer.service";
import {emailExamples} from "../../core/adapters/emailExamples";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import { UserEntity} from "../../users/domain/user.entity";


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
    },

    async registerUser(
        login: string,
        password: string,
        email: string
    ): Promise<UserEntity | null> {
        const user = await usersRepository.doesExistByLoginOrEmail(login, email);
        if (user) {
            throw new RepositoryNotFoundError("User already exist");
        }
        const passwordHash = await bcryptService.generateHash(password);
        const newUser = new UserEntity(login, email, passwordHash);


        await usersRepository.create(newUser);

console.log('newUser.emailConfirmation.confirmationCode',newUser.emailConfirmation.confirmationCode)
        nodemailerService
            .sendEmail(
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error('error in send email:', er));

        return newUser;
    }

};
