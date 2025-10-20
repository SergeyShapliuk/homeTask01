import { body } from 'express-validator';
import {
  dataIdMatchValidation,
  idValidation,
} from '../../core/middlewares/validation/params-id.validation-middleware';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/types/resource-type';

const URL_PATTERN =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body('name')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 15 })
  .withMessage('Length of name is not correct');

const descriptionValidation = body('description')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('description is required')
  .isLength({ max: 500 })
  .withMessage('Length of name is not correct');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('websiteUrl is required')
  .isLength({ min: 3, max: 100 })
  .withMessage('Length of name is not correct')
  .matches(URL_PATTERN)
  .withMessage(
    'URL должен быть в формате: https://example.com или https://sub.example.com/path',
  );

export const blogCreateInputValidation = [
  // resourceTypeValidation(ResourceType.Blogs),
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

export const blogUpdateInputValidation = [
  // resourceTypeValidation(ResourceType.Blogs),
  // dataIdMatchValidation,
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
