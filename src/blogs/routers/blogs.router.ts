import {Router} from "express";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {
    blogIdValidation,
    idValidation
} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    blogCreateInputValidation,
    blogUpdateInputValidation
} from "./blog.input-dto.validation-middlewares";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "./input/blog-sort-field";
import {PostSortField} from "../../posts/routers/input/post-sort-field";
import {getBlogPostListHandler} from "./handlers/get-blog-post-list.handler";
import {createBlogPostByIdHandler} from "./handlers/create-blog-post-by-id.handler";
import {
    postCreateInputValidation,
    postCreatePostByBlogIdInputValidation
} from "../../posts/routers/post.input-dto.validation-middlewares";

export const blogsRouter = Router({});

// blogsRouter.use(superAdminGuardMiddleware);
//
blogsRouter
    .get(
        "",
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogListHandler
    )

    .post(
        "",
        superAdminGuardMiddleware,
        blogCreateInputValidation,
        inputValidationResultMiddleware,
        createBlogHandler
    )

    .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)

    .put(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        blogUpdateInputValidation,
        inputValidationResultMiddleware,
        updateBlogHandler
    )

    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler
    )

    .post(
        "/:blogId/posts",
        superAdminGuardMiddleware,
        blogIdValidation,
        postCreatePostByBlogIdInputValidation,
        inputValidationResultMiddleware,
        createBlogPostByIdHandler
    )

    .get(
        "/:blogId/posts",
        blogIdValidation,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getBlogPostListHandler
    );
