import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { db } from '../../../db/db';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { blogsRepository } from '../../repositories/blogs.repository';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  const { name, description, websiteUrl } = req.body;

  // --- Успех ---
  const newBlog = {
    id: (db.blogs.length
      ? +db.blogs[db.blogs.length - 1].id + 1
      : 1
    ).toString(),
    name: name.trim(),
    description: description.trim(),
    websiteUrl: websiteUrl.trim(),
  };

  blogsRepository.create(newBlog);
  return res.status(HttpStatus.Created).send(newBlog);
}
