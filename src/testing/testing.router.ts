import {Router} from "express";
import {db} from "../db/db";
import {HttpStatus} from "../core/types/http-ststuses";


export const testingRouter = Router({});

testingRouter

    .delete("/all-data", ((req, res) => {
        db.videos = [];
        // Отправка статуса
        res.sendStatus(HttpStatus.NoContent);
    }))


