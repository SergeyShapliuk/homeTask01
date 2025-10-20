import { body } from 'express-validator';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/types/resource-type';

const titleValidation = body("title")
    .isString()
    .withMessage("name should be string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({max: 30})
    .withMessage("Length of name is not correct");

const shortDescriptionValidation = body("shortDescription")
    .isString()
    .withMessage("shortDescription should be string")
    .trim()
    .notEmpty()
    .withMessage("shortDescription is required")
    .isLength({max: 100})
    .withMessage("Length of name is not correct");

const contentValidation = body("content")
    .isString()
    .withMessage("content should be string")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({max: 1000})
    .withMessage("Length of name is not correct");

const blogIdValidation = body("blogId")
    .isString()
    .withMessage("blogId should be string")
    .trim()
    .notEmpty()
    .withMessage("blogId is required");

export const postCreateInputValidation = [
    // resourceTypeValidation(ResourceType.Posts),
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
];

export const postCreatePostByBlogIdInputValidation = [
    // resourceTypeValidation(ResourceType.Posts),
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
];

export const postUpdateInputValidation = [
    // resourceTypeValidation(ResourceType.Posts),
    // dataIdMatchValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
];
