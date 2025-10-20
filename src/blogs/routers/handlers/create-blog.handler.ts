import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {BlogCreateInput} from "../input/blog-create.input";
import {blogsService} from "../../application/blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {mapToPostOutputUtil} from "../../../posts/routers/mappers/map-to-post-output.util";
import {mapToBlogOutput} from "../mappers/map-to-blog-output.util";

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
    req: Request<{}, {}, BlogCreateInput>,
    res: Response,
) {
    console.log('createBlogHandler',  req?.body,)
    try {
        // const createdBlogId = await blogsService.create(
        //     req.body.data.attributes,
        // );
        const createdBlogId = await blogsService.create(
            req.body
        );

        const createdBlog = await blogsService.findByIdOrFail(createdBlogId);

        const blogOutput = mapToBlogOutput(createdBlog);

        res.status(HttpStatus.Created).send(blogOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
