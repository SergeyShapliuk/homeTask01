// src/posts/posts.router.ts
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
    postUpdateInputValidation, updateLikeStatusByPostIdInputValidation
} from "./post.input-dto.validation-middlewares";

import {CommentSortField} from "../../coments/routers/input/comment-sort-field";
import {CommentsPostController} from "./handlers/get-comment-post-list.handler";
import {createCommentPostByIdHandler} from "./handlers/create-comment-post-by-id.handler";

import {accessTokenGuard} from "../../auth/routers/guard/access.token.guard";
import {optionalAccessTokenGuard} from "../../auth/routers/guard/optional.access.token.guard";
import {updateLikeStatusHandler} from "../../coments/routers/handlers/update-like-status.handler";
import {updatePostLikeStatusHandler} from "./handlers/update-post-like-status.handler";

const commentsPostController = new CommentsPostController();

export class PostsRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            // GET /posts
            .get(
                "",
                optionalAccessTokenGuard,
                ...paginationAndSortingValidation(PostSortField),
                inputValidationResultMiddleware,
                getPostListHandler as any
            )

            // GET /posts/:id
            .get(
                "/:id",
                optionalAccessTokenGuard,
                idValidation,
                inputValidationResultMiddleware,
                getPostHandler
            )

            // POST /posts
            .post(
                "",
                optionalAccessTokenGuard,
                ...postCreateInputValidation,
                inputValidationResultMiddleware,
                createPostHandler
            )

            // PUT /posts/:id
            .put(
                "/:id",
                superAdminGuardMiddleware,
                idValidation,
                ...postUpdateInputValidation,
                inputValidationResultMiddleware,
                updatePostHandler
            )

            // DELETE /posts/:id
            .delete(
                "/:id",
                superAdminGuardMiddleware,
                idValidation,
                inputValidationResultMiddleware,
                deletePostHandler
            )

            // GET /posts/:postId/comments
            .get(
                "/:postId/comments",
                postIdValidation,
                optionalAccessTokenGuard as any,
                ...paginationAndSortingValidation(CommentSortField),
                inputValidationResultMiddleware,
                commentsPostController.getCommentPostList
            )

            // POST /posts/:postId/comments
            .post(
                "/:postId/comments",
                accessTokenGuard,
                postIdValidation,
                ...postCreateContentByPostIdInputValidation,
                inputValidationResultMiddleware,
                createCommentPostByIdHandler
            )

            .put(
                "/:postId/like-status",
                accessTokenGuard,
                ...updateLikeStatusByPostIdInputValidation,
                inputValidationResultMiddleware,
                updatePostLikeStatusHandler
            );
    }
}

export const postsRouter = new PostsRouter().router;
