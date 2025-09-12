import express, {Express} from "express";
import {videoRouter} from "./videos/routers/video.router";
import {testingRouter} from "./testing/routers/testing.router";
import {HttpStatus} from "./core/types/http-ststuses";
import {setupSwagger} from "./core/swagger/setup-swagger";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.use("/videos", videoRouter); // Подключаем роутеры
    app.use("/testing", testingRouter); // Подключаем тестовый роутер

    app.get("/", (req, res) => {
        res.status(HttpStatus.Ok).send("Hello world!");
    });

    setupSwagger(app);

    return app;
};
