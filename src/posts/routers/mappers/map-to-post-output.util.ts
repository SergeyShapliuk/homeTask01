import { WithId } from 'mongodb';
import { PostOutput } from '../output/post.output';
import { ResourceType } from '../../../core/types/resource-type';
import { Post } from '../../domain/post';

// export function mapToPostOutputUtil(post: WithId<Post>): PostOutput {
export function mapToPostOutputUtil(post: WithId<Post>): any {
  // return {
  //     data: {
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
  //     }
  // };
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
