import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {CommentCreateInput} from "../../../coments/routers/input/comment-create.input";
import {commentService} from "../../../coments/application/comment.service";
import {mapToCommentOutputUtil} from "../../../coments/routers/mappers/map-to-comment-output.util";
import {RequestWithParamsAndBodyAndUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";

export async function createCommentPostByIdHandler(
    req: RequestWithParamsAndBodyAndUserId<{ postId: string }, CommentCreateInput,IdType>,
    res: Response
) {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;
        const {content} = req.body;
        if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
console.log({postId})
console.log({userId})
console.log({content})
        const createdCommentId = await commentService.create({
            content,
            postId,
            userId
        });
        console.log({createdCommentId})
        const createdComment = await commentService.findByIdOrFail(createdCommentId);
        console.log({createdComment})
        const commentOutput = mapToCommentOutputUtil(createdComment);

        res.status(HttpStatus.Created).send(commentOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
