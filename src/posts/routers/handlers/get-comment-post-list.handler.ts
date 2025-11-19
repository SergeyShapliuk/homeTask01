import {Request, Response} from "express";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {matchedData} from "express-validator";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {PostQueryInput} from "../input/post-query.input";
import {postsService} from "../../application/posts.service";
import {commentService} from "../../../coments/application/comment.service";
import {mapToCommentListPaginatedOutput} from "../../../coments/routers/mappers/map-to-comment-list-paginated-output.util";
import {CommentQueryInput} from "../../../coments/routers/input/comment-query.input";

// export function getBlogListHandler(req: Request, res: Response) {
//   const blogs = blogsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }

export async function getCommentPostListHandler(
    req: Request<{ postId: string }, {}, {}, PostQueryInput>,
    res: Response
) {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;
        const sanitizedQuery = matchedData<CommentQueryInput>(req, {
            locations: ["query"],
            includeOptionals: true
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
        const {items, totalCount} = await postsService.findCommentsByPost(
            queryInput,
            postId,
            userId
        );
        console.log("getCommentPostListHandler1", postId);
        console.log("getCommentPostListHandler2", queryInput);
        console.log("getCommentPostListHandler3", items);
        const commentListOutput =await mapToCommentListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount
        }, userId);
        console.log("commentListOutput", commentListOutput);
        res.status(HttpStatus.Ok).send(commentListOutput);
    } catch (e) {
        errorsHandler(e, res);
    }
}
