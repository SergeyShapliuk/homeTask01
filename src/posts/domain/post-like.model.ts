import mongoose, {HydratedDocument, Model} from "mongoose";
import {POST_LIKE_COLLECTION_NAME} from "../../db/db";

export type PostLike = {
    userId: string;
    login: string;
    postId: string;
    status: "Like" | "Dislike" | "None";
    createdAt: string;
};

type PostLikeModel = Model<PostLike>

export type PostLikeDocument = HydratedDocument<PostLike>

const postLikeSchema = new mongoose.Schema<PostLike>({
    userId: {type: String, required: true},
    login: {type: String, required: true},
    postId: {type: String, required: true},
    status: {type: String, enum: ["Like", "Dislike"], default: "None", required: true},
    createdAt: {type: String, default: new Date().toISOString()}
});

// Уникальный индекс - один пользователь один лайк на комментарий
postLikeSchema.index({userId: 1, postId: 1}, {unique: true});

export const PostLikeModel = mongoose.model<PostLike, PostLikeModel>(POST_LIKE_COLLECTION_NAME, postLikeSchema);
