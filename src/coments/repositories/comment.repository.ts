import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {commentCollection, postCollection, userCollection} from "../../db/db";
import {Comment} from "../domain/comment";
import {PostAttributes} from "../../posts/application/dtos/post-attributes";
import {CommentAttributes} from "../application/dtos/comment-attributes";
import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";
import {Post} from "../../posts/domain/post";
import {CommentSortField} from "../routers/input/comment-sort-field";

export const commentRepository = {


    async findById(id: string): Promise<WithId<Comment> | null> {
        return commentCollection.findOne({_id: new ObjectId(id)});
    },

    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        const res = await commentCollection.findOne({_id: new ObjectId(id)});

        if (!res) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return res;
    },


    async create(newComment: Comment): Promise<string> {
        const insertResult = await commentCollection.insertOne(newComment);
        return insertResult.insertedId.toString();
    },

    async update(id: string, newComment: { content: string }): Promise<void> {
        const updateResult = await commentCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: newComment
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return;
    },


    async delete(id: string): Promise<void> {
        const deleteResult = await commentCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return;
    }

};
