import {Router} from "express";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {getPostHandler} from "./handlers/get-post.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {PostSortField} from "./input/post-sort-field";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {
    postCreateInputValidation,
    postUpdateInputValidation
} from "./post.input-dto.validation-middlewares";

export const postsRouter = Router({});

// postsRouter.use(superAdminGuardMiddleware);

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
        postCreateInputValidation,
        inputValidationResultMiddleware,
        createPostHandler
    )

    .put(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        postUpdateInputValidation,
        inputValidationResultMiddleware,
        updatePostHandler
    )

    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler
    );
