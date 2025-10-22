import {Router} from "express";
import {loginUserHandler} from "./handlers/create-user.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {authInputValidation} from "./auth.input-dto.validation-middlewares";

export const authRouter = Router({});

// authRouter.use(superAdminGuardMiddleware);

authRouter
    .post(
        "/login",
        authInputValidation,
        inputValidationResultMiddleware,
        loginUserHandler
    );
