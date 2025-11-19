import {Router} from "express";

import {updateCommentHandler} from "./handlers/update-comment.handler";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";
import {commentIdValidation, idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {accessTokenGuard} from "../../auth/routers/guard/access.token.guard";
import {
    postCreateContentByPostIdInputValidation,
    postCreatePostByBlogIdInputValidation,

    updateLikeStatusByPostIdInputValidation
} from "../../posts/routers/post.input-dto.validation-middlewares";
import {updateLikeStatusHandler} from "./handlers/update-like-status.handler";

export const commentsRouter = Router({});

// commentsRouter.use(superAdminGuardMiddleware);

commentsRouter
    .get(
        "/:id",
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        getCommentHandler
    )

    .put(
        "/:id",
        accessTokenGuard,
        idValidation,
        ...postCreateContentByPostIdInputValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )

    .put(
        "/:commentId/like-status",
        accessTokenGuard,
        ...updateLikeStatusByPostIdInputValidation,
        inputValidationResultMiddleware,
        updateLikeStatusHandler
    )

    .delete(
        "/:id",
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentHandler
    );
