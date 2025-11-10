import {Router} from "express";
import {refreshTokenGuard} from "../../auth/routers/guard/reftesh.token.guard";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {getDevicesHandler} from "./handlers/getDevicesHandler";
import {deleteDevicesHandler} from "./handlers/delete-devices.handler";
import {deleteDeviceByDeviceIdHandler} from "./handlers/delete-device-by-device-id.handler";

export const securityRouter = Router({});


securityRouter


    .get(
        "/devices",
        refreshTokenGuard,
        inputValidationResultMiddleware,
        getDevicesHandler
    )

    .delete(
        "/devices",
        refreshTokenGuard,
        inputValidationResultMiddleware,
        deleteDevicesHandler
    )

    .delete(
        "/devices/:deviceId",
        refreshTokenGuard,
        inputValidationResultMiddleware,
        deleteDeviceByDeviceIdHandler
    );



