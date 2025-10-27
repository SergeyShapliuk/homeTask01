import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { PostCreateInput } from '../input/post-create.input';
import { postsService } from '../../application/posts.service';
import { mapToPostOutputUtil } from '../mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';

// export function updateCommentHandler(
//     req: Request<{}, {}, PostInputDto>,
//     res: Response
// ) {
//     const {title, shortDescription, content, blogId} = req.body;
//
//     // --- Успех ---
//     const newPost: User = {
//         id: (db.posts.length
//                 ? +db.posts[db.posts.length - 1].id + 1
//                 : 1
//         ).toString(),
//         title: title.trim(),
//         shortDescription: shortDescription.trim(),
//         content: content.trim(),
//         blogId: blogId.trim(),
//         blogName: ""
//     };
//
//     postsRepository.create(newPost);
//     return res.status(HttpStatus.Created).send(newPost);
// }

export async function createPostHandler(
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) {
  // const {title, shortDescription, content, blogId} = req.body;

  // --- Успех ---
  try {
    // const createdPostId = await commentService.create(req.body.data.attributes);
    const createdPostId = await postsService.create(req.body);

    const createdPost = await postsService.findByIdOrFail(createdPostId);
    // const newPost: User = {
    //     title: title.trim(),
    //     shortDescription: shortDescription.trim(),
    //     content: content.trim(),
    //     blogId: blogId.trim(),
    //     blogName: "",
    //     createdAt: new Date().toISOString()
    // };

    // const createdPost = await postsRepository.create(newPost);
    // const postViewModel = mapToPostViewModel(createdPost);
    const postOutput = mapToPostOutputUtil(createdPost);
    res.status(HttpStatus.Created).send(postOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
