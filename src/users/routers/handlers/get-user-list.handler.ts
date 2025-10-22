import {Request, Response} from "express";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {matchedData} from "express-validator";
import {UserQueryInput} from "../input/user-query.input";
import {userService} from "../../application/user.service";
import {
    mapToUserListPaginatedOutput
} from "../mappers/map-to-user-list-paginated-output.util";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {HttpStatus} from "../../../core/types/http-ststuses";


export async function getUserListHandler(
    req: Request<{}, {}, {}, UserQueryInput>,
    res: Response
) {
    try {
        const sanitizedQuery = matchedData<UserQueryInput>(req, {
            locations: ["query"],
            includeOptionals: true
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const {items, totalCount} = await userService.findMany(queryInput);
        const postListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount
        });

        res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e) {
        errorsHandler(e, res);
    }
}
