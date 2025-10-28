import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {User} from "../domain/user";
import {userCollection} from "../../db/db";

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
    ): Promise<boolean> {
        const user = await userCollection.findOne({
            $or: [{ email }, { login }],
        });
        return !!user;
    },

};
