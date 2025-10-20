import {WithId} from "mongodb";
import {Blog} from "../../domain/blog";
import {BlogOutput} from "../output/blog.output";
import {ResourceType} from "../../../core/types/resource-type";


// export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
export function mapToBlogOutput(blog: WithId<Blog>): any {
    // return {
    //     data: {
    //         type: ResourceType.Blogs,
    //         id: blog._id.toString(),
    //         attributes: {
    //             name: blog.name,
    //             description: blog.description,
    //             websiteUrl: blog.websiteUrl,
    //             isMembership: blog.isMembership,
    //             createdAt: blog.createdAt
    //         }
    //     }
    // };
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt
    };
}
