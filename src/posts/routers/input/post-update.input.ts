import { ResourceType } from '../../../core/types/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostUpdateInput = {
  // data: {
  //     type: ResourceType.Posts;
  //     id: string;
  //     attributes: PostAttributes;
  // };
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
