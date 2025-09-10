import express, {Express} from "express";
import {videoRouter} from "./router/video.router";
import {db} from "./db";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.use("/videos", videoRouter);  // Подключаем роутеры

    // основной роут
    app.delete("/hometask_01/api/testing/all-data", ((req, res) => {
        db.videos = [];
        // Отправка статуса
        res.sendStatus(204);
    }));
    app.get("/", (req, res) => {
        res.status(200).send("hello world!!!");
    });

    return app;
};
