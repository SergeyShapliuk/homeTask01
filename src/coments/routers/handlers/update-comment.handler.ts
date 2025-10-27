import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {commentService} from "../../application/comment.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {CommentUpdateInput} from "../input/comment-update.input";
import {RequestWithParamsAndBodyAndUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {commentRepository} from "../../repositories/comment.repository";


export async function updateCommentHandler(
    req: RequestWithParamsAndBodyAndUserId<{ id: string }, CommentUpdateInput, IdType>,
    res: Response
) {
    try {
        const id = req.params.id;
        const userId = req.user?.id;

        const comment = await commentRepository.findByIdOrFail(id);
        if (comment.commentatorInfo.userId !== userId) {
            res.status(HttpStatus.Forbidden).send("If try delete the comment that is not your own");
            return;
        }
        console.log("updateCommentHandler", id);
        await commentService.update(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}

