import { body } from 'express-validator';


const loginValidation = body('login')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('title is required')
  .isLength({ max: 30 })
  .withMessage('Length of name is not correct');

const passwordValidation = body('password')
  .isString()
  .withMessage('shortDescription should be string')
  .trim()
  .notEmpty()
  .withMessage('shortDescription is required')
  .isLength({ max: 100 })
  .withMessage('Length of name is not correct');

const emailValidation = body('email')
  .isString()
  .withMessage('content should be string')
  .trim()
  .notEmpty()
  .withMessage('content is required')
  .isLength({ max: 1000 })
  .withMessage('Length of name is not correct');

export const userCreateInputValidation = [
  // resourceTypeValidation(ResourceType.Posts),
  loginValidation,
  passwordValidation,
  emailValidation,
];

export const userUpdateInputValidation = [
  // resourceTypeValidation(ResourceType.Posts),
  // dataIdMatchValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
];
