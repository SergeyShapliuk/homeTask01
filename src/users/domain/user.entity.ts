import {randomUUID} from "crypto";

export class UserEntity {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: string;
        isConfirmed: boolean;
    };

    constructor(login: string, email: string, hash: string) {
        this.login = login;
        this.email = email;
        this.passwordHash = hash;
        this.createdAt = new Date().toISOString();
        this.emailConfirmation = {
            expirationDate: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            confirmationCode: randomUUID(),
            isConfirmed: false
        };
    }

}
