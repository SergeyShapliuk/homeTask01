import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostQueryInput } from '../../../posts/routers/input/post-query.input';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-to-post-list-paginated-output.util';
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {matchedData} from "express-validator";
import {BlogQueryInput} from "../input/blog-query.input";

// export function getBlogListHandler(req: Request, res: Response) {
//   const blogs = blogsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }
export async function getBlogPostListHandler(
  req: Request<{ blogId: string }, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const blogId = req.params.blogId;
    // const queryInput = req.query;

    const sanitizedQuery = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
    const { items, totalCount } = await postsService.findPostsByBlog(
      queryInput,
      blogId,
    );
    console.log('getBlogPostListHandler1', blogId);
    console.log('getBlogPostListHandler2', queryInput);
    const blogListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(blogListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
