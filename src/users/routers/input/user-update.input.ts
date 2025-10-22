import { ResourceType } from '../../../core/types/resource-type';


export type UserUpdateInput = {
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
