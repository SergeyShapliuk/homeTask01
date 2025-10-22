import {ResourceType} from "../../../core/types/resource-type";

export type UserDataOutput = {
    // type: ResourceType.Posts;
    // id: string;
    // attributes: {
    //   title: string;
    //   shortDescription: string;
    //   content: string;
    //   blogId: string;
    //   blogName: string;
    //   createdAt: string;
    // };
    id: string;
    login: string;
    email: string;
    createdAt: string;
};
