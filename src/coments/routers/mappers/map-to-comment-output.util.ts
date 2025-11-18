import {WithId} from "mongodb";
import {CommentOutput} from "../output/comment.output";
import {Comment} from "../../domain/comment";

export function mapToCommentOutputUtil(comment: WithId<Comment>): CommentOutput {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo:{
            likesCount:comment.likesInfo.likesCount,
            dislikesCount:comment.likesInfo.dislikesCount,
            myStatus:comment.likesInfo.myStatus
        }
    };
}
