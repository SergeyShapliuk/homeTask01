import {Router} from "express";
import {loginUserHandler} from "./handlers/create-user.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {authInputValidation} from "./auth.input-dto.validation-middlewares";
import {getUserHandler} from "./handlers/get-user.handler";
import {accessTokenGuard} from "./guard/access.token.guard";
import {
    codeValidation,
    emailValidation,
    userCreateInputValidation
} from "../../users/routers/user.input-dto.validation-middlewares";
import {registrationUserHandler} from "./handlers/create-registration-user.handler";
import {confirmCodeHandler} from "./handlers/confirm-registration-user.handler";
import {resendCodeHandler} from "./handlers/resend-code-registration-user.handler";
import {body} from "express-validator";

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const loginValidation = body("login")
    .isString()
    .withMessage("Login should be string")
    .trim()
    .notEmpty()
    .withMessage("Login is required")
    .isLength({min: 3, max: 10})
    .withMessage("Login must be between 3 and 10 characters")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Login can only contain letters, numbers, underscores and hyphens");

export const passwordValidation = body("password")
    .isString()
    .withMessage("Password should be string")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 6, max: 20})
    .withMessage("Password must be between 6 and 20 characters");

export const emailValidation = body("email")
    .isString()
    .withMessage("Email should be string")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .matches(EMAIL_PATTERN)
    .withMessage("Invalid email format")
    .isLength({max: 100})
    .withMessage("Email is too long");
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
        [loginValidation, passwordValidation, emailValidation],
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

