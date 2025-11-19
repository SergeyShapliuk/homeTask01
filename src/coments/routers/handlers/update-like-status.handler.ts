import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {commentService} from "../../application/comment.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {CommentUpdateInput} from "../input/comment-update.input";
import {RequestWithParamsAndBodyAndUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {commentRepository} from "../../repositories/comment.repository";
import {commentLikeService} from "../../application/comment.like.service";


export async function updateLikeStatusHandler(
    req: RequestWithParamsAndBodyAndUserId<{ commentId: string }, { likeStatus: string }, IdType>,
    res: Response
) {
    try {
        const commentId = req.params.commentId;
        const userId = req.user?.id;
        const likeStatus = req.body.likeStatus;
        console.log("updateLikeStatusHandler", {userId});
        console.log("updateLikeStatusHandler", {commentId});
        if (!userId) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        const comment = await commentRepository.findByIdOrFail(commentId);
        if (comment.commentatorInfo.userId !== userId) {
            res.status(HttpStatus.Forbidden).send("If try delete the comment that is not your own");
            return;
        }

        console.log("updateCommentHandler", commentId);
        await commentLikeService.updateLikeStatus(commentId, userId, likeStatus);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}

