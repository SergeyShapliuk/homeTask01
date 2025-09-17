import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { postsRepository } from '../../repositories/posts.repository';

export function deletePostHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const blog = postsRepository.findById(id);

  if (!blog) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }

  // Удаление блога из массива
  postsRepository.delete(id);

  // Отправка статуса 204 (No Content) без тела ответа
  res.status(HttpStatus.NoContent).send('No Content');
}
