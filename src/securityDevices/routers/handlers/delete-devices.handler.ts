import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {RequestWithUserId} from "../../../core/types/requests";
import {IdType} from "../../../core/types/id";
import {sessionsRepository} from "../../repositories/sessions.repository";

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

export async function deleteDevicesHandler(
    req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const userId = req.user?.id as string;
    console.log('deleteBlogHandler1',userId)
    const refreshToken = req.cookies.refreshToken;
    await sessionsRepository.delete(refreshToken);

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
