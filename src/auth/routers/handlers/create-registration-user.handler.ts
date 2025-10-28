import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/user.service";
import {UserAttributes} from "../../../users/application/dtos/user-attributes";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";


export async function registrationUserHandler(
    req: Request<{}, {}, UserAttributes>,
    res: Response
) {
    try {
        const {login, password, email} = req.body;
        const user = await authService.registerUser(login, password, email);
        if (!user) {
            res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: "User with this email or login already exists",
                        field: "email" // или определите какое поле дублируется
                    }
                ]
            });
            return;
        }

        res.status(HttpStatus.NoContent).send();

    } catch (e) {
        errorsHandler(e, res);
    }
}
