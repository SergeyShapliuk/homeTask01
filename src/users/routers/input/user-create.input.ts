import { ResourceType } from '../../../core/types/resource-type';


export type UserCreateInput = {
  // data: {
  //     type: ResourceType.Posts;
  //     attributes: PostAttributes;
  // };

  login: string;
  password: string;
  email: string;
};
