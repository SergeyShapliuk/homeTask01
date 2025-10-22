import {Request, Response} from "express";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {matchedData} from "express-validator";
import {PostQueryInput} from "../input/post-query.input";
import {postsService} from "../../application/posts.service";
import {mapToPostListPaginatedOutput} from "../mappers/map-to-post-list-paginated-output.util";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {HttpStatus} from "../../../core/types/http-ststuses";

// export function getPostListHandler(req: Request, res: Response) {
//   const blogs = postsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }

export async function getPostListHandler(
    req: Request<{}, {}, {}, PostQueryInput>,
    res: Response
) {
    try {
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ["query"],
            includeOptionals: true
        });
        console.log("getPostListHandler", sanitizedQuery, req.query);
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
        console.log("getPostListHandler2", sanitizedQuery);
        console.log("getPostListHandler2.5", req.query);
        const {items, totalCount} = await postsService.findMany(queryInput);
        console.log("getPostListHandler3", {items, totalCount});
        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount
        });
        // const blogs = await postsRepository.findAll();
        // const postViewModels = blogs.map(mapToPostViewModel);
        res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e) {
        errorsHandler(e, res);
    }
}
