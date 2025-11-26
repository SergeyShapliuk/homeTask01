import {WithId} from "mongodb";

import {Post, PostModel} from "../domain/post";
import {postsRepository} from "../repositories/posts.repository";

import {PostAttributes} from "./dtos/post-attributes";
import {PostQueryInput} from "../routers/input/post-query.input";

import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";

import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";

import {CommentSortField} from "../../coments/routers/input/comment-sort-field";
import {Comment, CommentModel} from "../../coments/domain/comment";

export class PostsService {
    async findMany(
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findMany(queryDto);
    }

    async findPostsByBlog(
        paginationDto: PaginationAndSorting<BlogSortField>,
        blogId: string
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        await blogsRepository.findByIdOrFail(blogId);
        return postsRepository.findPostsByBlog(paginationDto, blogId);
    }

    async findCommentsByPost(
        paginationDto: PaginationAndSorting<CommentSortField>,
        postId: string,
        userId?: string
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        const post = await postsRepository.findByIdOrFail(postId);
        return postsRepository.findCommentsByPost(
            paginationDto,
            post._id.toString()
        );
    }

    // async createForBlog(dto: {
    //     title: string;
    //     shortDescription: string;
    //     content: string;
    //     blogId: string;
    // }): Promise<any> {
    //     const blog = await blogsRepository.findByIdOrFail(dto.blogId);
    //
    //     const newPost: Post = {
    //         title: dto.title,
    //         shortDescription: dto.shortDescription,
    //         content: dto.content,
    //         blogId: dto.blogId,
    //         blogName: blog.name,
    //         createdAt: new Date().toISOString()
    //     };
    //
    //     return await postsRepository.create(newPost);
    // }

    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        return postsRepository.findByIdOrFail(id);
    }

    async create(dto: PostAttributes): Promise<string> {
        const post = await blogsRepository.findByIdOrFail(dto.blogId);

        if (!post) {
            throw new RepositoryNotFoundError(
                `Driver has an active ride. Complete or cancel the ride first`
            );
        }

        const newPostData = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: post.name
            // createdAt: new Date().toISOString()
        };
        const newPost = new PostModel(newPostData);

        return await postsRepository.create(newPost);
    }

    async update(id: string, dto: PostAttributes): Promise<void> {
        await postsRepository.update(id, dto);
    }

    async delete(id: string): Promise<void> {
        await postsRepository.delete(id);
    }
}

export const postsService = new PostsService();
