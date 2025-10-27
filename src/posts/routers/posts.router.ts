import {Router} from "express";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {getPostHandler} from "./handlers/get-post.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {
    idValidation,
    postIdValidation
} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {PostSortField} from "./input/post-sort-field";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {
    postCreateContentByPostIdInputValidation,
    postCreateInputValidation,
    postUpdateInputValidation
} from "./post.input-dto.validation-middlewares";
import {CommentSortField} from "../../coments/routers/input/comment-sort-field";
import {getCommentPostListHandler} from "./handlers/get-comment-post-list.handler";
import {createCommentPostByIdHandler} from "./handlers/create-comment-post-by-id.handler";
import {accessTokenGuard} from "../../auth/routers/guard/access.token.guard";

export const postsRouter = Router({});

// commentsRouter.use(superAdminGuardMiddleware);

postsRouter
    .get(
        "",
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler
    )

    .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)

    .post(
        "",
        superAdminGuardMiddleware,
        ...postCreateInputValidation,
        inputValidationResultMiddleware,
        createPostHandler
    )

    .put(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        ...postUpdateInputValidation,
        inputValidationResultMiddleware,
        updatePostHandler
    )

    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler
    )

    .get(
        "/:postId/comments",
        postIdValidation,
        paginationAndSortingValidation(CommentSortField),
        inputValidationResultMiddleware,
        getCommentPostListHandler
    )

    .post(
        "/:postId/comments",
        accessTokenGuard,
        postIdValidation,
        ...postCreateContentByPostIdInputValidation,
        inputValidationResultMiddleware,
        createCommentPostByIdHandler
    );



