import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { UserCreateInput } from '../input/user-create.input';
import { userService } from '../../application/user.service';
import { mapToUserOutputUtil } from '../mappers/map-to-user-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';


export async function createUserHandler(
  req: Request<{}, {}, UserCreateInput>,
  res: Response,
) {
  try {
    const createdUserId = await userService.create(req.body);

    const createdUser = await userService.findByIdOrFail(createdUserId);

    const postOutput = mapToUserOutputUtil(createdUser);
    res.status(HttpStatus.Created).send(postOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
