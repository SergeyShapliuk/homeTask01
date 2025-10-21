import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import {errorsHandler} from "../../../core/errors/errors.handler";

// export function getBlogHandler(req: Request, res: Response) {
//   const id = parseInt(req.params.id);
//   // Проверка на валидное целое число
//   if (isNaN(id) || !Number.isInteger(id) || id < 1) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   // Поиск блога по ID
//   const blog = blogsRepository.findById(id);
//   if (!blog) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   res.status(HttpStatus.Ok).send(blog);
// }

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const blog = await blogsService.findByIdOrFail(id);
    // Поиск блога по ID
    // const blog = await blogsRepository.findById(id);

    // if (!blog) {
    //     res.status(HttpStatus.NotFound).send("Not Found");
    // }
    // console.log('blog',blog)
    const blogOutput = mapToBlogOutput(blog);
    res.status(HttpStatus.Ok).send(blogOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
