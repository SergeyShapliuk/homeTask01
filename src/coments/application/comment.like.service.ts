import {WithId} from "mongodb";
import {commentRepository} from "../repositories/comment.repository";
import {CommentQueryInput} from "../routers/input/comment-query.input";
import {CommentAttributes} from "./dtos/comment-attributes";
import {Comment, CommentModel} from "../domain/comment";
import {postsRepository} from "../../posts/repositories/posts.repository";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {usersRepository} from "../../users/repositories/users.repository";
import {commentsQwRepository} from "../repositories/comments.query.repository";
import {User} from "../../users/domain/user";
import {commentLikeRepository} from "../repositories/comment.like.repository";
import {CommentLike} from "../domain/comment-like.model";

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const commentLikeService = {

    // async findMany(
    //     queryDto: CommentQueryInput
    // ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    //     return commentsQwRepository.findMany(queryDto);
    // },
    //
    // async findLikeByIdOrFail(userId: string, commentId: string): Promise<WithId<CommentLike>> {
    //     return commentLikeRepository.findLikeByIdOrFail(userId, commentId);
    // },
    //
    async updateLikeStatus(commentId: string,
                           userId: string,
                           likeStatus: string): Promise<void> {
        // console.log({commentId, newLikeStatus, currentLikeStatus});
        await commentLikeRepository.updateLikeStatus(
            commentId,
            userId,
            likeStatus);
        return;
    }
};
