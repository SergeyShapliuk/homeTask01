import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { PostCreateInput } from '../../../posts/routers/input/post-create.input';
import { mapToPostOutputUtil } from '../../../posts/routers/mappers/map-to-post-output.util';
import { PostByBlogIdCreateInput } from '../../../posts/routers/input/post-by-blog-id-create.input';

export async function createBlogPostByIdHandler(
  req: Request<{ blogId: string }, {}, PostByBlogIdCreateInput>,
  res: Response,
) {
  try {
    const blogId = req.params.blogId;
    const { title, shortDescription, content } = req.body;

    const createdPostId = await postsService.create({
      title,
      shortDescription,
      content,
      blogId,
    });

    const createdPost = await postsService.findByIdOrFail(createdPostId);
    const postOutput = mapToPostOutputUtil(createdPost);

    res.status(HttpStatus.Created).send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
