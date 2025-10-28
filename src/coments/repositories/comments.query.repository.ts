import {CommentQueryInput} from "../routers/input/comment-query.input";
import {WithId} from "mongodb";
import {userCollection} from "../../db/db";
import {User} from "../../users/domain/user";

export const commentsQwRepository = {

    async findMany(
        queryDto: CommentQueryInput
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
        // const filter: any = {};
        const orConditions: any[] = [];

        // if (searchLoginTerm) {
        //     filter.login = {$regex: searchLoginTerm, $options: "i"};
        // }
        //
        // if (searchEmailTerm) {
        //     filter.email = {$regex: searchEmailTerm, $options: "i"};
        //}
        console.log('dsds',queryDto)
        if (searchLoginTerm && searchLoginTerm.trim() !== "") {
            orConditions.push({login: {$regex: searchLoginTerm, $options: "i"}});
        }

        if (searchEmailTerm && searchEmailTerm.trim() !== "") {
            orConditions.push({email: {$regex: searchEmailTerm, $options: "i"}});
        }

        const filter = orConditions.length > 0 ? {$or: orConditions} : {};

        const sortDirectionNumber = sortDirection === "asc" ? 1 : -1;

        const items = await userCollection
            .find(filter)
            // .collation({locale: "en", strength: 2})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);

        return {items, totalCount};
    }

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
