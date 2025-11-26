import {commentCollection, postCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {PostQueryInput} from "../routers/input/post-query.input";
import {PostAttributes} from "../application/dtos/post-attributes";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {Post, PostDocument} from "../domain/post";
import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";
import {CommentSortField} from "../../coments/routers/input/comment-sort-field";
import {Comment} from "../../coments/domain/comment";

class PostsRepositoryClass {
    async findMany(
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        const items = await postCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);

        return {items, totalCount};
    }

    async findPostsByBlog(
        paginationDto: PaginationAndSorting<BlogSortField>,
        blogId: string
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter = {blogId};

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter)
        ]);

        return {items, totalCount};
    }

    async findCommentsByPost(
        paginationDto: PaginationAndSorting<CommentSortField>,
        postId: string
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter = {postId};

        const [items, totalCount] = await Promise.all([
            commentCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            commentCollection.countDocuments(filter)
        ]);

        return {items, totalCount};
    }

    async findById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    }

    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        const res = await postCollection.findOne({_id: new ObjectId(id)});
        if (!res) {
            throw new RepositoryNotFoundError("Post not exist");
        }
        return res;
    }

    async findByBlogIdOrFail(blogId: string): Promise<WithId<Post>> {
        const res = await postCollection.findOne({_blogId: new ObjectId(blogId)});
        if (!res) {
            throw new RepositoryNotFoundError("User not exist");
        }
        return res;
    }

    async create(newPost: PostDocument): Promise<string> {
        const insertResult = await newPost.save();
        return insertResult._id.toString();
    }

    async update(id: string, newPost: PostAttributes): Promise<void> {
        const updateResult = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: newPost}
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("User not exist");
        }
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("User not exist");
        }
    }
}

// ✅ Создаем синглтон — один экземпляр на весь проект
export const postsRepository = new PostsRepositoryClass();
