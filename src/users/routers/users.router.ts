import {Router} from "express";
import {getUserListHandler} from "./handlers/get-user-list.handler";
import {createUserHandler} from "./handlers/create-user.handler";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {UserSortField} from "./input/user-sort-field";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {
    userCreateInputValidation
} from "./user.input-dto.validation-middlewares";

export const usersRouter = Router({});

usersRouter.use(superAdminGuardMiddleware);

usersRouter
    .get(
        "",
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getUserListHandler
    )

    .post(
        "",
        userCreateInputValidation,
        inputValidationResultMiddleware,
        createUserHandler
    )

    .delete(
        "/:id",
        idValidation,
        inputValidationResultMiddleware,
        deleteUserHandler
    );
