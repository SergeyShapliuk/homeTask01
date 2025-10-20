import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {postsRepository} from "../../repositories/posts.repository";
import {mapToPostOutputUtil} from "../mappers/map-to-post-output.util";
import {errorsHandler} from "../../../core/errors/errors.handler";

// export function getPostHandler(req: Request, res: Response) {
//   const id = parseInt(req.params.id);
//   // Проверка на валидное целое число
//   if (isNaN(id) || !Number.isInteger(id) || id < 1) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   // Поиск блога по ID
//   const blog = postsRepository.findById(id);
//   if (!blog) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   res.status(HttpStatus.Ok).send(blog);
// }

export async function getPostHandler(req: Request<{ id: string }>, res: Response) {
    try {
        const id = req.params.id;

        // Поиск блога по ID
        const post = await postsRepository.findByIdOrFail(id);
        // if (!post) {
        //     res.status(HttpStatus.NotFound).send("Not Found");
        //     return;
        // }
        const postOutput = mapToPostOutputUtil(post);

        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e) {
        errorsHandler(e, res);
    }
}
