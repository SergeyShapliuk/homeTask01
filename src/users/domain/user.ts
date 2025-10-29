import {ObjectId} from "mongodb";

export type User = {
    _id?: ObjectId;
    login: string;
    email: string;
    passwordHash?: string;
    createdAt: string;
    emailConfirmation?: {
        //default value can be nullable
        confirmationCode: string
        isConfirmed: boolean;
        //default value can be nullable
        expirationDate: string;
    },
};
