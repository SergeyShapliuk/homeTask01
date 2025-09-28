import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {BlogInputDto} from "../../dto/blog.input-dto";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";

// export function createBlogHandler(
//   req: Request<{}, {}, BlogInputDto>,
//   res: Response,
// ) {
//   const { name, description, websiteUrl } = req.body;
//
//   // --- Успех ---
//   const newBlog = {
//     id: (db.blogs.length
//       ? +db.blogs[db.blogs.length - 1].id + 1
//       : 1
//     ).toString(),
//     name: name.trim(),
//     description: description.trim(),
//     websiteUrl: websiteUrl.trim(),
//   };
//
//   blogsRepository.create(newBlog);
//   return res.status(HttpStatus.Created).send(newBlog);
// }
export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response
) {
    const {name, description, websiteUrl} = req.body;

    // --- Успех ---
    try {
        const newBlog: Blog = {
            name: name.trim(),
            description: description.trim(),
            websiteUrl: websiteUrl.trim(),
            createdAt: new Date(),
            isMembership: false
        };
        const createdBlog = await blogsRepository.create(newBlog);
        const blogViewModel = mapToBlogViewModel(createdBlog);
        res.status(HttpStatus.Created).send(blogViewModel);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
