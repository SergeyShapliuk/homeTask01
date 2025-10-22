import {Request, Response, Router} from "express";
import {HttpStatus} from "../../core/types/http-ststuses";
import {blogCollection, postCollection, userCollection} from "../../db/db";

export const testingRouter = Router({});

// testingRouter.delete('/all-data', (req, res) => {
//   db.videos = [];
//   // Отправка статуса
//   res.sendStatus(HttpStatus.NoContent);
// });

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    //truncate db
    await Promise.all([blogCollection.deleteMany(), postCollection.deleteMany(), userCollection.deleteMany()]);
    res.sendStatus(HttpStatus.NoContent);
});
