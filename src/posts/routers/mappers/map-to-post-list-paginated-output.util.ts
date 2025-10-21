import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/types/resource-type';
import { Post } from '../../domain/post';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  // ): PostListPaginatedOutput {
): any {
  // return {
  //     meta: {
  //         page: meta.pageNumber,
  //         pageSize: meta.pageSize,
  //         pageCount: Math.ceil(meta.totalCount / meta.pageSize),
  //         totalCount: meta.totalCount
  //     },
  //     data: posts.map((post) => ({
  //         type: ResourceType.Posts,
  //         id: post._id.toString(),
  //         attributes: {
  //             title: post.title,
  //             shortDescription: post.shortDescription,
  //             content: post.content,
  //             blogId: post.blogId,
  //             blogName: post.blogName,
  //             createdAt: post.createdAt
  //         }
  //     }))
  // };
  return {
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    })),
  };
}
