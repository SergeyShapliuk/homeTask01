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

    async updateLikeStatus(postId: string, userId: string, login: string, likeStatus: "Like" | "Dislike" | "None") {
        const current = await PostLikeModel.findOne({userId, postId});

        // Если лайк уже стоит — ничего не менять
        if (current && likeStatus === "Like") {
            return;
        }

        // Если был лайк — удаляем его
        if (current) {
            await PostLikeModel.deleteOne({userId, postId});

            await PostModel.updateOne(
                {_id: postId},
                {$inc: {"extendedLikesInfo.likesCount": -1}}
            );
        }

        // Если новый статус = "Like"
        if (likeStatus === "Like") {
            await PostLikeModel.create({
                userId,
                postId,
                login,
                createdAt: new Date().toISOString()
            });

            await PostModel.updateOne(
                {_id: postId},
                {$inc: {"extendedLikesInfo.likesCount": 1}}
            );
        }

        // Если новый статус = "Dislike"
        if (likeStatus === "Dislike") {
            await PostModel.updateOne(
                {_id: postId},
                {$inc: {"extendedLikesInfo.dislikesCount": 1}}
            );
        }

        // Если новый статус = None
        if (likeStatus === "None" && current === null) {
            // Был dislike
            await PostModel.updateOne(
                {_id: postId},
                {$inc: {"extendedLikesInfo.dislikesCount": -1}}
            );
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
        const likes = await PostLikeModel.find({postId, status: "Like"})
            .sort({createdAt: -1}) // или addedAt, в зависимости от вашей модели
            .limit(3)
            .select({ userId: 1, login: 1, createdAt: 1, _id: 0 })// выбираем нужные поля
            // .populate("userId", "login") // если login хранится в User модели
            .lean();
        console.log("getPostNewestLikes", likes);
        return likes.map(like => ({
            addedAt: like.createdAt, // или like.addedAt
            userId: like.userId, // или like.userId
            login: like.login // получаем login из populated user
        }));
    }
};
