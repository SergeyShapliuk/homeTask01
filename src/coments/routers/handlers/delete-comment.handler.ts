import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {commentService} from "../../application/comment.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithParamsAndUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {commentRepository} from "../../repositories/comment.repository";

export async function deleteCommentHandler(
    req: RequestWithParamsAndUserId<{ id: string }, IdType>,
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

        await commentService.delete(id);
        // Отправка статуса 204 (No Content) без тела ответа
        res.status(HttpStatus.NoContent).send("No Content");
    } catch (e) {
        errorsHandler(e, res);
    }
}
