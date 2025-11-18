import {CommentDataOutput} from "./comment-data.output";

export type CommentOutput = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    }
    createdAt: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    },
};
