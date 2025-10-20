import { ResourceType } from '../../../core/types/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostByBlogIdCreateInput = {
  // data: {
  //     type: ResourceType.Posts;
  //     attributes: PostAttributes;
  // };

  title: string;
  shortDescription: string;
  content: string;
};
