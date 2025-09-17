import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { blogInputDtoValidation } from '../validation/input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const blogsRouter = Router({});

blogsRouter
  .get('', getBlogListHandler)

  .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)

  .post(
    '',
    blogInputDtoValidation,
    superAdminGuardMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler,
  )

  .put(
    '/:id',
    idValidation,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    '/:id',
    idValidation,
    superAdminGuardMiddleware,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
