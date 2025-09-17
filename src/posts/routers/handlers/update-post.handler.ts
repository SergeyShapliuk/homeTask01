import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { PostInputDto } from '../../dto/post.input-dto';
import { postsRepository } from '../../repositories/posts.repository';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return res.sendStatus(HttpStatus.NotFound);
  }

  const blog = postsRepository.findById(id);
  if (!blog) {
    res.sendStatus(HttpStatus.NotFound).send('Not Found');
    return;
  }

  postsRepository.update(id, req.body);
  return res.sendStatus(HttpStatus.NoContent);
}
