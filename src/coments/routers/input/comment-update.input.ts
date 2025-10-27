import { ResourceType } from '../../../core/types/resource-type';


export type CommentUpdateInput = {
  // data: {
  //     type: ResourceType.Posts;
  //     id: string;
  //     attributes: PostAttributes;
  // };
  id: string;
  content: string;
};
