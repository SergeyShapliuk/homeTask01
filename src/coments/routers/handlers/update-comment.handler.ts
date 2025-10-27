import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {commentService} from "../../application/comment.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {CommentUpdateInput} from "../input/comment-update.input";


export async function updateCommentHandler(
    req: Request<{ id: string }, {}, CommentUpdateInput>,
    res: Response
) {
    try {
        const id = req.params.id;
        console.log("updateCommentHandler", id);
        await commentService.update(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}

