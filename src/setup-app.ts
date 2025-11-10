import express, {Express} from "express";
import {HttpStatus} from "./core/types/http-ststuses";
import {setupSwagger} from "./core/swagger/setup-swagger";
import {
    AUTH_PATH,
    BLOGS_PATH, COMMENTS_PATH,
    POSTS_PATH, SECURITY_PATH,
    TESTING_PATH, USERS_PATH,
    VIDEOS_PATH
} from "./core/paths/paths";
import {videoRouter} from "./videos/routers/video.router";
import {blogsRouter} from "./blogs/routers/blogs.router";
import {postsRouter} from "./posts/routers/posts.router";
import {testingRouter} from "./testing/routers/testing.router";
import {usersRouter} from "./users/routers/users.router";
import {authRouter} from "./auth/routers/auth.router";
import {commentsRouter} from "./coments/routers/comments.router";
import {securityRouter} from "./securityDevices/routers/security.router";
import cookieParser from "cookie-parser";
import session from "express-session";


export const setupApp = (app: Express) => {

    app.set("trust proxy", true);

    app.use(express.json()); // middleware для парсинга JSON в теле запроса
    app.use(cookieParser());


    app.use(VIDEOS_PATH, videoRouter); // Подключаем роутеры
    app.use(BLOGS_PATH, blogsRouter); // Подключаем роутеры
    app.use(POSTS_PATH, postsRouter); // Подключаем роутеры
    app.use(COMMENTS_PATH, commentsRouter); // Подключаем роутеры
    app.use(USERS_PATH, usersRouter); // Подключаем роутеры
    app.use(AUTH_PATH, authRouter); // Подключаем роутеры
    app.use(SECURITY_PATH, securityRouter); // Подключаем роутеры
    app.use(TESTING_PATH, testingRouter); // Подключаем тестовый роутер

    app.get("/", (req, res) => {
        res.status(HttpStatus.Ok).send("Task 01 02 03 04 05 06");
    });

    setupSwagger(app);

    return app;
};
