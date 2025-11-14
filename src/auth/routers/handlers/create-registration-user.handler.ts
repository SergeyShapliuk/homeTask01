import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {AuthAttributes} from "../../application/dtos/auth-attributes";
import {authService} from "../../application/auth.service";
import {UserAttributes} from "../../../users/application/dtos/user-attributes";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";


export async function registrationUserHandler(
    req: Request<{}, {}, UserAttributes>,
    res: Response
) {
    try {
        const {login, password, email} = req.body;
        const result = await authService.registerUser(login, password, email);
        console.log({result})
        if (!result.user) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                    {
                        message: `User with this ${result.duplicateField} already exists`,
                        field: result.duplicateField!
                    }
                ]
            });
        }

        return res.sendStatus(HttpStatus.NoContent);

    } catch (e) {
        errorsHandler(e, res);
    }
}
