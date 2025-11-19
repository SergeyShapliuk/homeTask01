import {WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {CommentModel} from "../domain/comment";
import {CommentLike, CommentLikeModel} from "../domain/comment-like.model";
import mongoose from "mongoose";

export const commentLikeRepository = {

    async findLikeById(userId: string, commentId: string): Promise<WithId<CommentLike> | null> {
        return CommentLikeModel.findOne({userId, commentId});
    },

    async findLikeByIdOrFail(userId: string, commentId: string): Promise<WithId<CommentLike>> {
        const res = await this.findLikeById(userId, commentId);
        if (!res) {
            throw new RepositoryNotFoundError("Like not exist");
        }
        return res;
    },

    async updateLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: string
    ): Promise<void> {
        const currentLike = await this.findLikeById(userId, commentId);

        if (currentLike?.status === likeStatus) {
            return;
        }

        // УБИРАЕМ транзакции - выполняем операции последовательно
        try {
            // Удаляем предыдущий лайк если был
            if (currentLike) {
                await CommentLikeModel.deleteOne({ userId, commentId });

                // Уменьшаем предыдущий счетчик
                const previousField = currentLike.status === 'Like'
                    ? { "likesInfo.likesCount": -1 }
                    : { "likesInfo.dislikesCount": -1 };

                await CommentModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(commentId) },
                    { $inc: previousField }
                );
            }

            // Добавляем новый лайк если не "None"
            if (likeStatus !== 'None') {
                await CommentLikeModel.create({
                    userId,
                    commentId,
                    status: likeStatus as 'Like' | 'Dislike'
                });

                // Увеличиваем новый счетчик
                const newField = likeStatus === 'Like'
                    ? { "likesInfo.likesCount": 1 }
                    : { "likesInfo.dislikesCount": 1 };

                await CommentModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(commentId) },
                    { $inc: newField }
                );
            }
        } catch (error) {
            // Логируем ошибку, но не блокируем всю операцию
            console.error('Error updating like status:', error);
            throw error;
        }
    },

    async getUserLikeStatus(commentId: string, userId?: string): Promise<'Like' | 'Dislike' | 'None'> {
        if (!userId) return 'None';

        const like = await CommentLikeModel.findOne({ userId, commentId });
        return like?.status || 'None';
    }
};
