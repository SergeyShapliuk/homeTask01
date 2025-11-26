import {WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import mongoose from "mongoose";
import {PostLike, PostLikeModel} from "../domain/post-like.model";
import {PostModel} from "../domain/post";

export const postLikeRepository = {

    async findLikeById(userId: string, postId: string): Promise<WithId<PostLike> | null> {
        return PostLikeModel.findOne({userId, postId});
    },

    async findLikeByIdOrFail(userId: string, commentId: string): Promise<WithId<PostLike>> {
        const res = await this.findLikeById(userId, commentId);
        if (!res) {
            throw new RepositoryNotFoundError("Like not exist");
        }
        return res;
    },

    async updateLikeStatus(
        postId: string,
        userId: string,
        login: string,
        likeStatus: "Like" | "Dislike" | "None"
    ): Promise<void> {
        const currentLike = await this.findLikeById(userId, postId);

        if (currentLike?.status === likeStatus) {
            return;
        }

        try {
            // Удаляем предыдущий лайк если был
            if (currentLike) {
                await PostLikeModel.deleteOne({userId, postId});

                // Уменьшаем предыдущий счетчик
                const previousField = currentLike.status === "Like"
                    ? {"extendedLikesInfo.likesCount": -1}
                    : {"extendedLikesInfo.dislikesCount": -1};

                await PostModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(postId)},
                    {$inc: previousField}
                );

                // УДАЛЯЕМ из newestLikes если был лайк
                if (currentLike.status === "Like") {
                    await PostModel.updateOne(
                        {_id: new mongoose.Types.ObjectId(postId)},
                        {$pull: {"extendedLikesInfo.newestLikes": {userId}}}
                    );
                }
            }

            // Добавляем новый лайк если не "None"
            if (likeStatus !== "None") {
                const newLike = {
                    userId,
                    postId,
                    login,
                    status: likeStatus,
                    createdAt: new Date().toISOString()
                };

                await PostLikeModel.create(newLike);

                // Увеличиваем новый счетчик
                const newField = likeStatus === "Like"
                    ? {"extendedLikesInfo.likesCount": 1}
                    : {"extendedLikesInfo.dislikesCount": 1};

                await PostModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(postId)},
                    {$inc: newField}
                );

                // ДОБАВЛЯЕМ в newestLikes если это лайк
                if (likeStatus === "Like") {
                    const newestLikeInfo = {
                        addedAt: newLike.createdAt,
                        userId: newLike.userId,
                        login: newLike.login
                    };

                    await PostModel.updateOne(
                        {_id: new mongoose.Types.ObjectId(postId)},
                        {
                            $push: {
                                "extendedLikesInfo.newestLikes": {
                                    $each: [newestLikeInfo],
                                    $sort: {addedAt: -1},
                                    $slice: 3 // сохраняем только 3 последних
                                }
                            }
                        }
                    );
                }
            }
        } catch (error) {
            console.error("Error updating like status:", error);
            throw error;
        }
    },

    async getUserPostLikeStatus(postId: string, userId?: string): Promise<"Like" | "Dislike" | "None"> {
        if (!userId) return "None";

        const like = await PostLikeModel.findOne({userId, postId});
        return like?.status || "None";
    },

    async getPostNewestLikes(postId: string): Promise<{
        addedAt: string,
        userId: string,
        login: string
    }[]> {
        if (!postId) return [];
        const likes = await PostLikeModel.find({postId})
            .sort({createdAt: -1}) // или addedAt, в зависимости от вашей модели
            .limit(3)
            .select("userId login createdAt") // выбираем нужные поля
            // .populate("userId", "login") // если login хранится в User модели
            .exec();
        console.log("getPostNewestLikes", likes);
        return likes.map(like => ({
            addedAt: like.createdAt, // или like.addedAt
            userId: like.userId, // или like.userId
            login: like.login // получаем login из populated user
        }));
    }
};
