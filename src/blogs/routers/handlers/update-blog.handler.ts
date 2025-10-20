import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {BlogUpdateInput} from "../input/blog-update.input";
import {blogsService} from "../../application/blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";

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
    req: Request<{ id: string }, {}, BlogUpdateInput>,
    res: Response
) {
    try {
        const id = req.params.id;

        // await blogsService.update(id, req.body.data.attributes);
        await blogsService.update(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}
