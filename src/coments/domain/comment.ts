import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {COMMENTS_COLLECTION_NAME} from "../../db/db";

export type Comment = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: string;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        // myStatus: string
    },
    postId?: string;
};

type CommentModel = Model<Comment>

export type CommentDocument = HydratedDocument<Comment>

const commentatorInfoSchema = new mongoose.Schema<{
    userId: string;
    userLogin: string;
}>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}

});

const likesInfoSchema = new mongoose.Schema<{
    likesCount: number;
    dislikesCount: number;
    // myStatus: string;
}>({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    // myStatus: {type: String, default: "None"}

});

const commentSchema = new mongoose.Schema<Comment>({
    content: String,
    commentatorInfo: {type: commentatorInfoSchema, required: true},
    likesInfo: {
        type: likesInfoSchema,
        default: () => ({ likesCount: 0, dislikesCount: 0 })
    },
    createdAt: {type: String, default: () => new Date().toISOString()},
    postId: String
});

export const CommentModel = model<Comment, CommentModel>(COMMENTS_COLLECTION_NAME, commentSchema);
