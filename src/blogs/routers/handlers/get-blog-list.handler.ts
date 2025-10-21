import { Request, Response } from 'express';
import { BlogQueryInput } from '../input/blog-query.input';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {HttpStatus} from "../../../core/types/http-ststuses";
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

// export function getBlogListHandler(req: Request, res: Response) {
//   const blogs = blogsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }
export async function getBlogListHandler(
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response,
) {
  try {
    const sanitizedQuery = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    }); //утилита для извечения трансформированных значений после валидатара
    //в req.query остаются сырые квери параметры (строки)

    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await blogsService.findMany(queryInput);


    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(blogsListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
