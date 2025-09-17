import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { postInputDtoValidation } from '../validation/input-dto.validation-middlewares';

export const postsRouter = Router({});

postsRouter
  .get('', getPostListHandler)

  .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)

  .post(
    '',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )

  .put(
    '/:id',
    idValidation,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )

  .delete(
    '/:id',
    idValidation,
    superAdminGuardMiddleware,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
