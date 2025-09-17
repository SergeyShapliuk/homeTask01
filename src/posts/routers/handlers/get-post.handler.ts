import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { postsRepository } from '../../repositories/posts.repository';

export function getPostHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  // Проверка на валидное целое число
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }
  // Поиск блога по ID
  const blog = postsRepository.findById(id);
  if (!blog) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }
  res.status(HttpStatus.Ok).send(blog);
}
