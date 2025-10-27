import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { commentService } from '../../application/comment.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await commentService.delete(id);
    // Отправка статуса 204 (No Content) без тела ответа
    res.status(HttpStatus.NoContent).send('No Content');
  } catch (e) {
    errorsHandler(e, res);
  }
}
