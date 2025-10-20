import { Request, Response } from 'express';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../input/post-query.input';
import { postsService } from '../../application/posts.service';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {HttpStatus} from "../../../core/types/http-ststuses";

// export function getPostListHandler(req: Request, res: Response) {
//   const blogs = postsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }

export async function getPostListHandler(
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findMany(queryInput);

    const rideListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    // const blogs = await postsRepository.findAll();
    // const postViewModels = blogs.map(mapToPostViewModel);
    res.status(HttpStatus.Ok).send(rideListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
