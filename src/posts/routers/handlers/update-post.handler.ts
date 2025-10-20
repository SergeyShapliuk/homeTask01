import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {PostUpdateInput} from "../input/post-update.input";
import {postsService} from "../../application/posts.service";
import {errorsHandler} from "../../../core/errors/errors.handler";


// export function updatePostHandler(
//   req: Request<{ id: string }, {}, PostInputDto>,
//   res: Response,
// ) {
//   const id = parseInt(req.params.id);
//
//   if (isNaN(id) || !Number.isInteger(id) || id < 1) {
//     return res.sendStatus(HttpStatus.NotFound);
//   }
//
//   const blog = postsRepository.findById(id);
//   if (!blog) {
//     res.sendStatus(HttpStatus.NotFound).send('Not Found');
//     return;
//   }
//
//   postsRepository.update(id, req.body);
//   return res.sendStatus(HttpStatus.NoContent);
// }

export async function updatePostHandler(
    req: Request<{ id: string }, {}, PostUpdateInput>,
    res: Response
) {
    try {
        const id = req.params.id;
        // await postsService.update(id, req.body.data.attributes);
        await postsService.update(id, req.body);
        // const post = await postsRepository.findById(id);
        // if (!post) {
        //     res.sendStatus(HttpStatus.NotFound).send("Not Found");
        //     return;
        // }

        // await postsRepository.update(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        // res.sendStatus(HttpStatus.InternalServerError);
        errorsHandler(e, res);
    }
}
