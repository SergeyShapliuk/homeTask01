import {UserQueryInput} from "../routers/input/user-query.input";
import {WithId} from "mongodb";
import {User} from "../domain/user";
import {userCollection} from "../../db/db";

export const usersQwRepository = {

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
            filter.login = {$regex: searchLoginTerm, $options: "i"};
        }

        if (searchEmailTerm) {
            filter.email = {$regex: searchEmailTerm, $options: "i"};
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

    // async findById(id: string): Promise<IUserView | null> {
    //     const user = await db
    //         .getCollections()
    //         .usersCollection.findOne({ _id: new ObjectId(id) });
    //     return user ? this._getInView(user) : null;
    // },
    // _getInView(user: WithId<IUserDB>): IUserView {
    //     return {
    //         id: user._id.toString(),
    //         login: user.login,
    //         email: user.email,
    //         createdAt: user.createdAt.toISOString(),
    //     };
    // },
    // _checkObjectId(id: string): boolean {
    //     return ObjectId.isValid(id);
    // },
};
