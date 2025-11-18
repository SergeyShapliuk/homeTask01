import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {Comment, CommentDocument, CommentModel} from "../domain/comment";


export const commentRepository = {


    async findById(id: string): Promise<WithId<Comment> | null> {
        return CommentModel.findOne({_id: new ObjectId(id)});
    },

    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        console.log({id});
        const res = await this.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return res;
    },


    async create(newComment: CommentDocument): Promise<string> {
        const insertResult = await newComment.save();
        console.log({insertResult});
        return insertResult._id.toString();
    },

    async update(id: string, newComment: { content: string }): Promise<void> {
        const updateResult = await CommentModel.updateOne(
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

    async updateLikeStatus(  id: string,
                             userId: string,
                             newLikeStatus: string,
                             currentLikeStatus: string): Promise<void> {
        // Если статус не изменился - ничего не делаем
        if (currentLikeStatus === newLikeStatus) {
            return;
        }
        const updateOperations: any = {
            "likesInfo.myStatus": newLikeStatus
        };

        // Уменьшаем предыдущий счетчик
        if (currentLikeStatus === "Like") {
            updateOperations.$inc = { "likesInfo.likesCount": -1 };
        } else if (currentLikeStatus === "Dislike") {
            updateOperations.$inc = { "likesInfo.dislikesCount": -1 };
        }

        // Увеличиваем новый счетчик (только если не "None")
        if (newLikeStatus === "Like") {
            updateOperations.$inc = {
                ...updateOperations.$inc,
                "likesInfo.likesCount": 1
            };
        } else if (newLikeStatus === "Dislike") {
            updateOperations.$inc = {
                ...updateOperations.$inc,
                "likesInfo.dislikesCount": 1
            };
        }

        const updateResult = await CommentModel.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: updateOperations
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return;
    },

    async delete(id: string): Promise<void> {
        const deleteResult = await CommentModel.deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return;
    }

};
