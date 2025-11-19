import {WithId} from "mongodb";
import {Comment} from "../../domain/comment";
import {CommentListPaginatedOutput} from "../output/comment-list-paginated.output";
import {commentLikeRepository} from "../../repositories/comment.like.repository";
import {mapToCommentOutputUtil} from "./map-to-comment-output.util";
import {CommentOutput} from "../output/comment.output";

export async function mapToCommentListPaginatedOutput(
    comments: WithId<Comment>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
    userId?: string | undefined
): Promise<CommentListPaginatedOutput> {
console.log({userId})
    const items = await Promise.all(
        comments.map(comment => mapToCommentOutputUtil(comment, userId))
    );
    return {
        page: Number(meta.pageNumber),
        pageSize: Number(meta.pageSize),
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items
    };
}
