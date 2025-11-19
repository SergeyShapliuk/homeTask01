import {CommentOutput} from "../output/comment.output";
import {commentLikeRepository} from "../../repositories/comment.like.repository";
import {Comment} from "../../domain/comment";

export async function mapToCommentOutputUtil(comment: any, userId?: string): Promise<CommentOutput> {
    // Получаем статус текущего пользователя
    const myStatus = await commentLikeRepository.getUserLikeStatus(
        comment?._id.toString() || "",
        userId
    );
    return {
        id: comment?._id.toString() || "",
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo?.likesCount || 0,
            dislikesCount: comment.likesInfo?.dislikesCount || 0,
            myStatus: myStatus
        }
    };
}
