import {ResourceType} from "../../../core/types/resource-type";
import {BlogAttributes} from "../../application/dtos/blog-attributes";


export type BlogCreateInput = {
    // data: {
    //     type: ResourceType.Blogs;
    //     attributes: BlogAttributes;
    // };
    name: string;
    description: string;
    websiteUrl: string;
};
