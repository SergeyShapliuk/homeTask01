import {Request, Response} from "express";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {mapToCommentOutputUtil} from "../mappers/map-to-comment-output.util";
import {commentRepository} from "../../repositories/comment.repository";


export async function getCommentHandler(
    req: Request<{ id: string }>,
    res: Response
) {
    try {
        const id = req.params.id;
        const comment = await commentRepository.findByIdOrFail(id);
        const commentOutput = mapToCommentOutputUtil(comment);
        res.status(HttpStatus.Ok).send(commentOutput);
    } catch (e) {
        errorsHandler(e, res);
    }
}
