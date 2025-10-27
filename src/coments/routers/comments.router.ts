import {Router} from "express";

import {updateCommentHandler} from "./handlers/update-comment.handler";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {CommentSortField} from "./input/comment-sort-field";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {
    userCreateInputValidation
} from "./comment.input-dto.validation-middlewares";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {accessTokenGuard} from "../../auth/routers/guard/access.token.guard";

export const commentsRouter = Router({});

// commentsRouter.use(superAdminGuardMiddleware);

commentsRouter
    .get(
        "/:id",
        idValidation,
        inputValidationResultMiddleware,
        getCommentHandler
    )

    .put(
        "/:id",
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )

    .delete(
        "/:id",
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentHandler
    );
