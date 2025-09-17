import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { postsRepository } from '../../repositories/posts.repository';

export function getPostListHandler(req: Request, res: Response) {
  const blogs = postsRepository.findAll();
  res.status(HttpStatus.Ok).send(blogs);
}
