import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {IdType} from "../../../core/types/id";
import {RequestWithUserId} from "../../../core/types/requests";
import {usersRepository} from "../../../users/repositories/users.repository";


export async function getUserHandler(
    req: RequestWithUserId<IdType>,
    res: Response
) {
    try {
        const userId = req.user?.id as string;
        if (!userId) return res.sendStatus(HttpStatus.Unauthorized);

        const me = await usersRepository.findById(userId);

        const response = {
            login: me?.login,
            email: me?.email,
            userId: me?._id.toString()
        };
        return res.status(HttpStatus.Ok).send(response);
    } catch (e) {
        errorsHandler(e, res);
    }
}
