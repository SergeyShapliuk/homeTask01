import {body} from "express-validator";

const EMAIL_PATTERN =
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


const loginValidation = body("login")
    .isString()
    .withMessage("Login should be string")
    .trim()
    .notEmpty()
    .withMessage("Login is required")
    .isLength({min: 3, max: 10})
    .withMessage("Login must be between 3 and 10 characters")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Login can only contain letters, numbers, underscores and hyphens");

const passwordValidation = body("password")
    .isString()
    .withMessage("Password should be string")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 6, max: 20})
    .withMessage("Password must be between 6 and 20 characters");

const emailValidation = body("email")
    .isString()
    .withMessage("Email should be string")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .matches(EMAIL_PATTERN)
    .withMessage("Invalid email format")
    .isLength({max: 100})
    .withMessage("Email is too long");

export const userCreateInputValidation = [
    // resourceTypeValidation(ResourceType.Posts),
    loginValidation,
    passwordValidation,
    emailValidation
];

export const userUpdateInputValidation = [
    // resourceTypeValidation(ResourceType.Posts),
    // dataIdMatchValidation,
    loginValidation,
    passwordValidation,
    emailValidation
];
