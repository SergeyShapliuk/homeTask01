import {WithId} from "mongodb";
import {Comment} from "../../domain/comment";
import {CommentListPaginatedOutput} from "../output/comment-list-paginated.output";

export function mapToCommentListPaginatedOutput(
    comments: WithId<Comment>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): CommentListPaginatedOutput {

    return {
        page: Number(meta.pageNumber),
        pageSize: Number(meta.pageSize),
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: comments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }))
    };
}
