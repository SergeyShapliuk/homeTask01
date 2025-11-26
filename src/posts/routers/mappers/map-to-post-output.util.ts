import {WithId} from "mongodb";
import {PostOutput} from "../output/post.output";
import {Post} from "../../domain/post";
import {postLikeRepository} from "../../repositories/posts.like.repository";


export async function mapToPostOutputUtil(post: WithId<Post>, userId?: string): Promise<PostOutput> {
    const myStatus = await postLikeRepository.getUserPostLikeStatus(
        post?._id.toString() || "",
        userId
    );
    const newestLikes = await postLikeRepository.getPostNewestLikes(
        post?._id.toString() || ""
    );
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
            newestLikes
        }
    };
}
