import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {postsService} from "../../application/posts.service";
import {errorsHandler} from "../../../core/errors/errors.handler";

// export function deletePostHandler(req: Request, res: Response) {
//   const id = parseInt(req.params.id);
//   const blog = postsRepository.findById(id);
//
//   if (!blog) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//
//   // Удаление блога из массива
//   postsRepository.delete(id);
//
//   // Отправка статуса 204 (No Content) без тела ответа
//   res.status(HttpStatus.NoContent).send('No Content');
// }

export async function deletePostHandler(req: Request<{ id: string }>, res: Response) {
    try {
        const id = req.params.id;

        await postsService.delete(id);
        // const post = await postsRepository.findById(id);
        //
        // if (!post) {
        //     return res.status(HttpStatus.NotFound).send("Not Found");
        // }
        // // Удаление блога из массива
        // await postsRepository.delete(id);

        // Отправка статуса 204 (No Content) без тела ответа
        res.status(HttpStatus.NoContent).send("No Content");
    } catch (e) {
        errorsHandler(e, res);
    }
}
