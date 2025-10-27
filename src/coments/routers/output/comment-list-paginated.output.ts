import { PaginatedOutput } from '../../../core/types/paginated.output';
import {CommentDataOutput} from "./comment-data.output";

export type CommentListPaginatedOutput = {
  // meta: PaginatedOutput;
  // data: CommentDataOutput[];
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: CommentDataOutput[];
};
