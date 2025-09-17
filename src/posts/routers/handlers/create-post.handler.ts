import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { db } from '../../../db/db';
import { PostInputDto } from '../../dto/post.input-dto';
import { postsRepository } from '../../repositories/posts.repository';
import { Post } from '../../types/post';

export function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const { title, shortDescription, content, blogId } = req.body;

  // --- Успех ---
  const newPost: Post = {
    id: (db.posts.length
      ? +db.posts[db.posts.length - 1].id + 1
      : 1
    ).toString(),
    title: title.trim(),
    shortDescription: shortDescription.trim(),
    content: content.trim(),
    blogId: blogId.trim(),
    blogName: '',
  };

  postsRepository.create(newPost);
  return res.status(HttpStatus.Created).send(newPost);
}
