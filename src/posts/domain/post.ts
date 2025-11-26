import mongoose, {HydratedDocument, Model} from "mongoose";
import {POSTS_COLLECTION_NAME} from "../../db/db";

export type Post = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        // newestLikes: Array<{
        //     addedAt: string;
        //     userId: string;
        //     login: string;
        // }>;
    };
};

type PostModel = Model<Post>;
export type PostDocument = HydratedDocument<Post>;

// Схема для newestLikes
const newestLikesSchema = new mongoose.Schema<{
    addedAt: string;
    userId: string;
    login: string;
}>({
    addedAt: {type: String, default: () => new Date().toISOString()},
    userId: {type: String, required: true},
    login: {type: String, required: true}
}, {
    _id: false
});

// Схема для extendedLikesInfo (исправленная)
const extendedLikesInfoSchema = new mongoose.Schema<{
    likesCount: number;
    dislikesCount: number;
    // newestLikes: Array<{
    //     addedAt: string;
    //     userId: string;
    //     login: string;
    // }>;
}>({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    // newestLikes: [newestLikesSchema] // ✅ Добавлен newestLikes
}, {
    _id: false
});

// Основная схема поста
const PostSchema = new mongoose.Schema<Post>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogName: {type: String, required: true},
    blogId: {type: String, required: true},
    extendedLikesInfo: {
        type: extendedLikesInfoSchema,
        default: () => ({
            likesCount: 0,
            dislikesCount: 0,
            // newestLikes: []
        })
    },
    createdAt: {type: String, default: () => new Date().toISOString()}
});

// Создание модели
export const PostModel = mongoose.model<Post, PostModel>(POSTS_COLLECTION_NAME, PostSchema);
