import {WithId} from "mongodb";
import {ResourceType} from "../../../core/types/resource-type";
import {Blog} from "../../domain/blog";
import {BlogListPaginatedOutput} from "../output/blog-list-paginated.output";


export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
// ): BlogListPaginatedOutput {
):  any {
    // return {
    //     meta: {
    //         page: meta.pageNumber,
    //         pageSize: meta.pageSize,
    //         pageCount: Math.ceil(meta.totalCount / meta.pageSize),
    //         totalCount: meta.totalCount
    //     },
    //     data: blogs.map((blog) => ({
    //         type: ResourceType.Blogs,
    //         id: blog._id.toString(),
    //         attributes: {
    //             name: blog.name,
    //             description: blog.description,
    //             websiteUrl: blog.websiteUrl,
    //             isMembership: blog.isMembership,
    //             createdAt: blog.createdAt
    //         }
    //     }))
    // };
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pageCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: blogs.map((blog) => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt
        }))
    };
}
