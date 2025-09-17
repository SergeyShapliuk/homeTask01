import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { blogsRepository } from '../../repositories/blogs.repository';

export function getBlogHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  // Проверка на валидное целое число
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }
  // Поиск блога по ID
  const blog = blogsRepository.findById(id);
  if (!blog) {
    return res.status(HttpStatus.NotFound).send('Not Found');
  }
  res.status(HttpStatus.Ok).send(blog);
}
