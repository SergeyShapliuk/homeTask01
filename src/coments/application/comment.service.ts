import {WithId} from "mongodb";
import {commentRepository} from "../repositories/comment.repository";
import {CommentQueryInput} from "../routers/input/comment-query.input";
import {CommentAttributes} from "./dtos/comment-attributes";
import {usersQwRepository} from "../repositories/users.query.repository";
import {bcryptService} from "../../core/adapters/bcrypt.service";
import {Comment} from "../domain/comment";
import {PostAttributes} from "../../posts/application/dtos/post-attributes";
import {postsRepository} from "../../posts/repositories/posts.repository";
import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";
import {Post} from "../../posts/domain/post";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {PostSortField} from "../../posts/routers/input/post-sort-field";
import {CommentSortField} from "../routers/input/comment-sort-field";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {usersRepository} from "../../users/repositories/users.repository";

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const commentService = {

    async findMany(
        queryDto: CommentQueryInput
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        return usersQwRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        return commentRepository.findByIdOrFail(id);
    },


    async create(dto: CommentAttributes): Promise<string> {
        const {content} = dto;
        const post = await postsRepository.findByIdOrFail(dto.postId);
        const user = await usersRepository.findById(dto.userId);

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


        const newComment: Comment = {
            content,
            commentatorInfo: {
                userId: dto.userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: dto.postId
        };

        return await commentRepository.create(newComment);
    },

    async delete(id: string): Promise<void> {

        await commentRepository.delete(id);
        return;
    },

    async update(id: string, dto: { content: string }): Promise<void> {
        await commentRepository.update(id, dto);
        return;
    }


};
