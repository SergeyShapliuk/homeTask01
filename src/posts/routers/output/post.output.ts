import {PostDataOutput} from "./post-data.output";

export type PostOutput = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: "Like" | "Dislike" | "None",
        newestLikes: Array<{
            addedAt: string;
            userId: string;
            login: string;
        }>;
    };
};
