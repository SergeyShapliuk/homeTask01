import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { blogsRepository } from '../../repositories/blogs.repository';

export function getBlogListHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
  res.status(HttpStatus.Ok).send(blogs);
}
