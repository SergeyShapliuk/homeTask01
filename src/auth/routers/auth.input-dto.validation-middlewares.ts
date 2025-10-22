import {body} from "express-validator";


const loginOrEmailValidation = body("loginOrEmail")
    .isString()
    .withMessage("Login should be string")
    .trim()
    .notEmpty()
    .withMessage("Login is required")
    // .isLength({min: 3, max: 10})
    // .withMessage("Login must be between 3 and 10 characters")
    //
const passwordValidation = body("password")
    .isString()
    .withMessage("Password should be string")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    // .isLength({min: 6, max: 20})
    // .withMessage("Password must be between 6 and 20 characters");


export const authInputValidation = [
    loginOrEmailValidation,
    passwordValidation,
];
