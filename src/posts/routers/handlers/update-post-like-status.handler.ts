import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {RequestWithParamsAndBodyAndUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {postsRepository} from "../../repositories/posts.repository";
import {postLikeService} from "../../application/post.like.service";
import {usersRepository} from "../../../users/repositories/users.repository";


export async function updatePostLikeStatusHandler(
    req: RequestWithParamsAndBodyAndUserId<{ postId: string }, { likeStatus: "Like" | "Dislike" | "None" }, IdType>,
    res: Response
) {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;
        const likeStatus = req.body.likeStatus;
        console.log("updatePostLikeStatusHandler userId", {userId});
        console.log("updatePostLikeStatusHandler postId", {postId});
        if (!userId) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        await postsRepository.findByIdOrFail(postId);
        const user = await usersRepository.findById(userId);
        // if (comment.commentatorInfo.userId !== userId) {
        //     res.status(HttpStatus.Forbidden).send("If try delete the comment that is not your own");
        //     return;
        // }
        if (!user?.login) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        console.log("updatePostLikeStatusHandler post", {user});

        await postLikeService.updateLikeStatus(postId, userId, user.login, likeStatus);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}

