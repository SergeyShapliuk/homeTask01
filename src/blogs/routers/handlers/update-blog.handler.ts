import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {BlogInputDto} from "../../dto/blog.input-dto";
import {blogsRepository} from "../../repositories/blogs.repository";

// export function updateBlogHandler(
//   req: Request<{ id: string }, {}, BlogInputDto>,
//   res: Response,
// ) {
//   const id = parseInt(req.params.id);
//
//   if (isNaN(id) || !Number.isInteger(id) || id < 1) {
//     return res.sendStatus(HttpStatus.NotFound);
//   }
//
//   const blog = blogsRepository.findById(id);
//   if (!blog) {
//     res.sendStatus(HttpStatus.NotFound).send('Not Found');
//     return;
//   }
//
//   blogsRepository.update(id, req.body);
//   return res.sendStatus(HttpStatus.NoContent);
// }

export async function updateBlogHandler(
    req: Request<{ id: string }, {}, BlogInputDto>,
    res: Response
) {
    try {
        const id = req.params.id;

        const blog = await blogsRepository.findById(id);
        if (!blog) {
            res.sendStatus(HttpStatus.NotFound).send("Not Found");
            return;
        }

        await blogsRepository.update(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
