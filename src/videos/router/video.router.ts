import {Router} from "express";
import {db} from "../../db/db";
import {Video} from "../types/video";
import {HttpStatus} from "../../core/types/http-ststuses";
import {inputDtoValidation} from "../validation/inputDtoValidation";
import {inputUpdateDtoValidation} from "../validation/inputUpdateDtoValidation";


export const videoRouter = Router();

videoRouter

    .get("", ((req, res) => {
        res.status(HttpStatus.Ok).send(db.videos);
    }))

    .get("/:id", ((req, res) => {
        const id = parseInt(req.params.id);
        // Проверка на валидное целое число
        if (isNaN(id) || !Number.isInteger(id) || id < 1) {
            return res.status(HttpStatus.NotFound).send("If video for passed id doesn`t exist");
        }
        // Поиск видео по ID
        const video = db.videos.find(v => v.id === id);
        if (!video) {
            return res.status(HttpStatus.NotFound).send("If video for passed id doesn`t exist");
        }
        res.status(HttpStatus.Ok).send(video);
    }))

    .post("", (req, res) => {
        const {title, author, availableResolutions} = req.body;
        const errors = inputDtoValidation(req.body);

        // --- Если есть ошибки ---
        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send({errorsMessages: errors});
        }

        // --- Успех ---
        const newVideo = {
            id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
            title: title.trim(),
            author: author.trim(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date(Date.now() + 86400000).toISOString(),
            availableResolutions
        };

        db.videos.push(newVideo);
        return res.status(HttpStatus.Created).send(newVideo);
    })

    .put("/:id", (req, res) => {
        const {id} = req.params;
        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;

        const errors = inputUpdateDtoValidation(req.body);

        const videoId = parseInt(id);
        if (isNaN(videoId) || !Number.isInteger(videoId) || videoId < 1) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        const videoIndex = db.videos.findIndex(v => v.id === videoId);
        if (videoIndex === -1) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send({errorsMessages: errors});
        }

        // --- Обновление ---
        const updatedVideo: Video = {
            ...db.videos[videoIndex],
            title: title.trim(),
            author: author.trim(),
            availableResolutions,
            canBeDownloaded,
            minAgeRestriction,
            publicationDate: new Date(publicationDate).toISOString()
        };

        db.videos[videoIndex] = updatedVideo;
        return res.sendStatus(HttpStatus.NoContent);
    })


    .delete("/:id", ((req, res) => {
        const id = parseInt(req.params.id);

        // Проверка на валидное целое число
        if (isNaN(id) || !Number.isInteger(id) || id < 1) {
            return res.status(HttpStatus.NotFound).send("Not Found");
        }

        // Поиск индекса видео по ID
        const videoIndex = db.videos.findIndex(v => v.id === id);
        if (videoIndex === -1) {
            return res.status(HttpStatus.NotFound).send("Not Found");
        }

        // Удаление видео из массива
        db.videos.splice(videoIndex, 1);

        // Отправка статуса 204 (No Content) без тела ответа
        res.status(HttpStatus.NoContent).send("No Content");
    }));


