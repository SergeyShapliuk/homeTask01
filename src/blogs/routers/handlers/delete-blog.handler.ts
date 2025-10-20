import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

// export function deleteBlogHandler(req: Request, res: Response) {
//   const id = parseInt(req.params.id);
//   const blog = blogsRepository.findById(id);
//
//   if (!blog) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//
//   // Удаление блога из массива
//   blogsRepository.delete(id);
//
//   // Отправка статуса 204 (No Content) без тела ответа
//   res.status(HttpStatus.NoContent).send('No Content');
// }

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  console.log('deleteBlogHandler',req.params.id)
  try {
    const id = req.params.id;
    console.log('deleteBlogHandler1',id)
    await blogsService.delete(id);

    // if (!blog) {
    //     return res.status(HttpStatus.NotFound).send("Not Found");
    // }
    // // Удаление блога из массива
    // await blogsRepository.delete(id);

    // Отправка статуса 204 (No Content) без тела ответа
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}
