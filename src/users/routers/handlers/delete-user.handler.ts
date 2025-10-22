import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { userService } from '../../application/user.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteUserHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await userService.delete(id);
    // Отправка статуса 204 (No Content) без тела ответа
    res.status(HttpStatus.NoContent).send('No Content');
  } catch (e) {
    errorsHandler(e, res);
  }
}
