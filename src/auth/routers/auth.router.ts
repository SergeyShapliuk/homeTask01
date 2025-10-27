import {Router} from "express";
import {loginUserHandler} from "./handlers/create-user.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {authInputValidation} from "./auth.input-dto.validation-middlewares";
import {getUserHandler} from "./handlers/get-user.handler";
import {accessTokenGuard} from "./guard/access.token.guard";

export const authRouter = Router({});

// authRouter.use(superAdminGuardMiddleware);

authRouter

    .post(
        "/login",
        authInputValidation,
        inputValidationResultMiddleware,
        loginUserHandler
    )

    .get(
        "/me",
        accessTokenGuard,
        inputValidationResultMiddleware,
        getUserHandler
    );
