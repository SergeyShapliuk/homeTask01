import {WithId} from "mongodb";
import {ResourceType} from "../../../core/types/resource-type";
import {Post} from "../../domain/post";
import {PostListPaginatedOutput} from "../output/post-list-paginated.output";
import {postLikeRepository} from "../../repositories/posts.like.repository";

export async function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
    userId?: string
    // ): CommentListPaginatedOutput {
): Promise<any> {
// Создаем массив промисов для всех постов
    const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
            const myStatus = await postLikeRepository.getUserPostLikeStatus(
                post._id.toString(),
                userId
            );
            const newestLikes = await postLikeRepository.getPostNewestLikes(
                post._id.toString()
            );
            let filteredNewestLikes = newestLikes;
            if (myStatus === "Dislike") {
                filteredNewestLikes = [];
            }

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo.likesCount,
                    dislikesCount: post.extendedLikesInfo.dislikesCount,
                    myStatus,
                    newestLikes: filteredNewestLikes
                }
            };
        })
    );
    return {
        page: Number(meta.pageNumber),
        pageSize: Number(meta.pageSize),
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: postsWithLikes
    };
}
