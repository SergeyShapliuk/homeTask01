import mongoose, {HydratedDocument, Model} from "mongoose";
import {COMMENT_LIKE_COLLECTION_NAME} from "../../db/db";

export type CommentLike = {
    userId: string;
    commentId: string;
    status: "Like" | "Dislike" | "None";
    createdAt: Date;
};

type CommentLikeModel = Model<CommentLike>

export type CommentLikeDocument = HydratedDocument<CommentLike>

const commentLikeSchema = new mongoose.Schema<CommentLike>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    status: {type: String, enum: ["Like", "Dislike"], default: "None", required: true},
    createdAt: {type: Date, default: Date.now}
});

// Уникальный индекс - один пользователь один лайк на комментарий
commentLikeSchema.index({userId: 1, commentId: 1}, {unique: true});

export const CommentLikeModel = mongoose.model<CommentLike, CommentLikeModel>(COMMENT_LIKE_COLLECTION_NAME, commentLikeSchema);
