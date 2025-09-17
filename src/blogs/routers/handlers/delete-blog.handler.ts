import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { blogsRepository } from '../../repositories/blogs.repository';

export function deleteBlogHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const blog = blogsRepository.findById(id);

  if (!blog) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }

  // Удаление блога из массива
  blogsRepository.delete(id);

  // Отправка статуса 204 (No Content) без тела ответа
  res.status(HttpStatus.NoContent).send('No Content');
}
