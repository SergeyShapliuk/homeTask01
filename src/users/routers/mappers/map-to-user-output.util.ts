import {WithId} from "mongodb";
import {UserOutput} from "../output/user.output";
import {ResourceType} from "../../../core/types/resource-type";
import {User} from "../../domain/user";

export function mapToUserOutputUtil(user: WithId<User>): UserOutput {
    // return {
    //     data: {
    //         type: ResourceType.Posts,
    //         id: post._id.toString(),
    //         attributes: {
    //             title: post.title,
    //             shortDescription: post.shortDescription,
    //             content: post.content,
    //             blogId: post.blogId,
    //             blogName: post.blogName,
    //             createdAt: post.createdAt
    //         }
    //     }
    // };
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
}
