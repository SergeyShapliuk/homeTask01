import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {User} from "../domain/user";
import {UserQueryInput} from "../routers/input/user-query.input";
import {userCollection} from "../../db/db";

export const usersRepository = {

    async findMany(
        queryDto: UserQueryInput
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchLoginTerm) {
            filter.email = {$regex: searchLoginTerm, $options: "i"};
        }

        if (searchEmailTerm) {
            filter["vehicle.make"] = {$regex: searchEmailTerm, $options: "i"};
        }

        const items = await userCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);

        return {items, totalCount};
    },

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

    async create(newPost: User): Promise<string> {
        const insertResult = await userCollection.insertOne(newPost);
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
    }
};
