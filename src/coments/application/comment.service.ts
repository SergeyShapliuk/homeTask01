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

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const commentService = {

    async findMany(
        queryDto: CommentQueryInput
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return commentsQwRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        return commentRepository.findByIdOrFail(id);
    },


    async create(dto: CommentAttributes): Promise<string> {
        const post = await postsRepository.findByIdOrFail(dto.postId);
        const user = await usersRepository.findById(dto.userId);
        console.log({post});
        console.log({user});
        if (!user) {
            throw new RepositoryNotFoundError(
                `User has not exist`
            );
        }
        if (!post) {
            throw new RepositoryNotFoundError(
                `Post has not exist`
            );
        }
        const commentData = {
            content: dto.content,
            commentatorInfo: {  // только это поле обязательно
                userId: dto.userId,
                userLogin: user.login
            },
            postId: dto.postId
            // likesInfo и createdAt создадутся автоматически
        };
        const newComment = new CommentModel(commentData);

        console.log({newComment});

        return await commentRepository.create(newComment);
    },

    async delete(id: string): Promise<void> {

        await commentRepository.delete(id);
        return;
    },

    async update(id: string, dto: { content: string }): Promise<void> {
        await commentRepository.update(id, dto);
        return;
    },

    // async updateLikeStatus(commentId: string,
    //                        userId: string,
    //                        likeStatus: string): Promise<void> {
    //     // console.log({commentId, newLikeStatus, currentLikeStatus});
    //     await commentRepository.updateLikeStatus(
    //         commentId,
    //         newLikeStatus,
    //         currentLikeStatus);
    //     return;
    // }


};
