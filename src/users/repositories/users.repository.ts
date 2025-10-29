import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {User} from "../domain/user";
import {userCollection} from "../../db/db";
import {UserEntity} from "../domain/user.entity";

export const usersRepository = {


    async findById(id: string): Promise<WithId<User> | null> {
        return userCollection.findOne({_id: new ObjectId(id)});
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({_id: new ObjectId(id)});

        if (!res) {
            throw new RepositoryNotFoundError("User not exist");
        }
        return res;
    },

    async create(newUser: User): Promise<string> {
        const insertResult = await userCollection.insertOne(newUser);
        return insertResult.insertedId.toString();
    },

    async delete(id: string): Promise<void> {
        const deleteResult = await userCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("User not exist");
        }
        return;
    },

    async findByLoginOrEmail(
        loginOrEmail: string
    ): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}]
        });
    },

    async doesExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<{ exists: boolean, field?: "login" | "email" }> {
        // Сначала проверяем логин
        const existingByLogin = await userCollection.findOne({login});
        if (existingByLogin) {
            return {exists: true, field: "login"};
        }

        // Затем проверяем email
        const existingByEmail = await userCollection.findOne({email});
        if (existingByEmail) {
            return {exists: true, field: "email"};
        }

        return {exists: false};
    },

    async findByConfirmationCode(code: string): Promise<User | null> {
        return await userCollection.findOne({
            "emailConfirmation.confirmationCode": code
        });
    },

    // В usersRepository
    async confirmEmail(userId: ObjectId): Promise<boolean> {
        const result = await userCollection.updateOne(
            {_id: userId},
            {
                $set: {
                    "emailConfirmation.isConfirmed": true
                }
            }
        );

        return result.modifiedCount === 1;
    },

    async updateConfirmationCode(
        userId: ObjectId,
        newCode: string,
        newExpirationDate: string
    ): Promise<boolean> {
        try {
            const result = await userCollection.updateOne(
                { _id: userId },
                {
                    $set: {
                        "emailConfirmation.confirmationCode": newCode,
                        "emailConfirmation.expirationDate": newExpirationDate
                    }
                }
            );

            console.log('Update confirmation code result:', result.modifiedCount);
            return result.modifiedCount === 1;
        } catch (error) {
            console.error("Update confirmation code error:", error);
            return false;
        }
    }
};
