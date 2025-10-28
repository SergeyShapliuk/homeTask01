import {Router} from "express";
import {loginUserHandler} from "./handlers/create-user.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {authInputValidation} from "./auth.input-dto.validation-middlewares";
import {getUserHandler} from "./handlers/get-user.handler";
import {accessTokenGuard} from "./guard/access.token.guard";
import {
    codeValidation,
    emailValidation, loginValidation, passwordValidation,
    userCreateInputValidation
} from "../../users/routers/user.input-dto.validation-middlewares";
import {registrationUserHandler} from "./handlers/create-registration-user.handler";
import {confirmCodeHandler} from "./handlers/confirm-registration-user.handler";
import {resendCodeHandler} from "./handlers/resend-code-registration-user.handler";
import {body} from "express-validator";

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
    )

    .post(
        "/registration",
        [loginValidation, passwordValidation, body("email")
            .isEmail()
            .withMessage("Invalid email format")
            .normalizeEmail()],
        inputValidationResultMiddleware,
        registrationUserHandler
    )

    .post(
        "/registration-confirmation",
        codeValidation,
        inputValidationResultMiddleware,
        confirmCodeHandler
    )

    .post(
        "/registration-email-resending",
        emailValidation,
        inputValidationResultMiddleware,
        resendCodeHandler
    );

