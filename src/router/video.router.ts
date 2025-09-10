import {Router} from "express";
import {db, NewVideo, Resolution, VALID_RESOLUTIONS} from "../db";

export const videoRouter = Router();

videoRouter.get("", ((req, res) => {
    res.status(200).send(db.videos);
}));

videoRouter.get("/:id", ((req, res) => {
    const id = parseInt(req.params.id);
    // Проверка на валидное целое число
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
        return res.status(404).send("If video for passed id doesn`t exist");
    }
    // Поиск видео по ID
    const video = db.videos.find(v => v.id === id);
    if (!video) {
        return res.status(404).send("If video for passed id doesn`t exist");
    }
    res.status(200).send(video);
}));

videoRouter.post("", (req, res) => {
    const { title, author, availableResolutions } = req.body;
    const errors: { message: string; field: string }[] = [];

// --- Проверка title ---
    if (typeof title !== "string") {
        errors.push({ message: "Title is required and must be a string", field: "title" });
    } else {
        const trimmedTitle: string = (title as string).trim();
        if (trimmedTitle.length === 0) {
            errors.push({ message: "Title cannot be empty", field: "title" });
        } else if (trimmedTitle.length > 40) {
            errors.push({ message: "Title must be less than 40 characters", field: "title" });
        }
    }

// --- Проверка author ---
    if (typeof author !== "string") {
        errors.push({ message: "Author is required and must be a string", field: "author" });
    } else {
        const trimmedAuthor: string = (author as string).trim();
        if (trimmedAuthor.length === 0) {
            errors.push({ message: "Author cannot be empty", field: "author" });
        } else if (trimmedAuthor.length > 20) {
            errors.push({ message: "Author must be less than 20 characters", field: "author" });
        }
    }


    // --- Проверка availableResolutions ---
    if (availableResolutions === undefined || availableResolutions === null) {
        errors.push({ message: "AvailableResolutions is required", field: "availableResolutions" });
    } else if (!Array.isArray(availableResolutions)) {
        errors.push({ message: "AvailableResolutions must be an array", field: "availableResolutions" });
    } else if (availableResolutions.length === 0) {
        errors.push({ message: "At least one resolution is required", field: "availableResolutions" });
    } else {
        for (const resolution of availableResolutions) {
            if (typeof resolution !== "string") {
                errors.push({ message: "Each resolution must be a string", field: "availableResolutions" });
                break;
            }
            const resolutionTyped = resolution as Resolution;
            if (!VALID_RESOLUTIONS.includes(resolutionTyped)) {
                errors.push({
                    message: `Invalid resolution: ${resolution}. Allowed: ${VALID_RESOLUTIONS.join(", ")}`,
                    field: "availableResolutions"
                });
                break;
            }
        }
    }

    // --- Если есть ошибки ---
    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }

    // --- Успех ---
    const newVideo = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 86400000).toISOString(),
        availableResolutions
    };

    db.videos.push(newVideo);
    return res.status(201).send(newVideo);
});


// videoRouter.put("/:id", ((req, res) => {
//     const {id} = req.params;
//     const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;
//
//     const errors: { message: string; field: string }[] = [];
//
//     // 1. Валидация ID
//     const videoId = parseInt(id);
//     if (isNaN(videoId) || !Number.isInteger(videoId) || videoId < 1) {
//         return res.status(404).send("Not Found");
//     }
//
//     // 2. Поиск видео
//     const videoIndex = db.videos.findIndex(v => v.id === videoId);
//     if (videoIndex === -1) {
//         return res.status(404).send("Not Found");
//     }
//     const existingVideo = db.videos[videoIndex];
//     // 3. Валидация полей согласно спецификации
//     // Title validation (required, string, maxLength: 40)
//     if (title === undefined || title === null) {
//         errors.push({message: "Title is required", field: "title"});
//     } else if (typeof title !== "string") {
//         errors.push({message: "Title must be a string", field: "title"});
//     } else {
//         const titleValue = title as string;
//         const trimmedTitle = titleValue.trim();
//         if (trimmedTitle.length === 0) {
//             errors.push({message: "Title cannot be empty", field: "title"});
//         } else if (trimmedTitle.length > 40) {
//             errors.push({message: "Title must be less than 40 characters", field: "title"});
//         }
//     }
//
//     // Author validation (required, string, maxLength: 20)
//     if (author === undefined || author === null) {
//         errors.push({message: "Author is required", field: "author"});
//     } else if (typeof author !== "string") {
//         errors.push({message: "Author must be a string", field: "author"});
//     } else {
//         const authorValue = author as string;
//         const trimmedAuthor = authorValue.trim();
//         if (trimmedAuthor.length === 0) {
//             errors.push({message: "Author cannot be empty", field: "author"});
//         } else if (trimmedAuthor.length > 20) {
//             errors.push({message: "Author must be less than 20 characters", field: "author"});
//         }
//     }
//
//     // AvailableResolutions validation
//     if (availableResolutions !== undefined && availableResolutions !== null) {
//         if (!Array.isArray(availableResolutions)) {
//             errors.push({message: "AvailableResolutions must be an array", field: "availableResolutions"});
//         } else {
//             const duplicateResolutions = new Set();
//
//             for (const resolution of availableResolutions) {
//                 // Проверка на валидность разрешения
//                 if (typeof resolution !== "string") {
//                     errors.push({message: "Each resolution must be a string", field: "availableResolutions"});
//                 } else if (!VALID_RESOLUTIONS.includes(resolution as Resolution)) {
//                     errors.push({
//                         message: `Invalid resolution: ${resolution}. Allowed: ${VALID_RESOLUTIONS.join(", ")}`,
//                         field: "availableResolutions"
//                     });
//                 }
//                 // Проверка на дубликаты в пришедшем массиве
//                 else if (availableResolutions.filter(r => r === resolution).length > 1) {
//                     duplicateResolutions.add(resolution);
//                 }
//                 // Проверка на существование в БД
//                 else if (existingVideo.availableResolutions.includes(resolution as Resolution)) {
//                     errors.push({
//                         message: `Resolution ${resolution} already exists in video`,
//                         field: "availableResolutions"
//                     });
//                 }
//             }
//
//             // Добавляем ошибку для дубликатов в пришедшем массиве
//             if (duplicateResolutions.size > 0) {
//                 errors.push({
//                     message: `Duplicate resolutions in request: ${Array.from(duplicateResolutions).join(", ")}`,
//                     field: "availableResolutions"
//                 });
//             }
//         }
//     }
//
//     // CanBeDownloaded validation (required, boolean)
//     if (canBeDownloaded === undefined || canBeDownloaded === null) {
//         errors.push({message: "CanBeDownloaded is required", field: "canBeDownloaded"});
//     } else if (typeof canBeDownloaded !== "boolean") {
//         errors.push({message: "CanBeDownloaded must be a boolean", field: "canBeDownloaded"});
//     }
//
//     // MinAgeRestriction validation (required, number between 1-18 or null)
//     if (minAgeRestriction === undefined) {
//         errors.push({message: "MinAgeRestriction is required", field: "minAgeRestriction"});
//     } else if (minAgeRestriction !== null) {
//         if (typeof minAgeRestriction !== "number" || !Number.isInteger(minAgeRestriction)) {
//             errors.push({message: "MinAgeRestriction must be an integer or null", field: "minAgeRestriction"});
//         } else if (minAgeRestriction < 1 || minAgeRestriction > 18) {
//             errors.push({message: "MinAgeRestriction must be between 1 and 18 or null", field: "minAgeRestriction"});
//         }
//     }
//
//     // PublicationDate validation (required, valid ISO date string)
//     if (publicationDate === undefined || publicationDate === null) {
//         errors.push({message: "PublicationDate is required", field: "publicationDate"});
//     } else if (typeof publicationDate !== "string") {
//         errors.push({message: "PublicationDate must be a string", field: "publicationDate"});
//     } else if (isNaN(Date.parse(publicationDate))) {
//         errors.push({message: "PublicationDate must be a valid ISO date string", field: "publicationDate"});
//     }
//
//
//     // 4. Если есть ошибки - возвращаем
//     if (errors.length > 0) {
//         return res.status(400).send({errorsMessages: errors});
//     }
//
//     // 5. Обновляем видео
//     const updatedVideo: NewVideo = {
//         ...db.videos[videoIndex],
//         title: title.trim(),
//         author: author.trim(),
//         availableResolutions: availableResolutions
//             ? [...existingVideo.availableResolutions, ...availableResolutions] // Добавляем новые к существующим
//             : existingVideo.availableResolutions,
//         canBeDownloaded,
//         minAgeRestriction: minAgeRestriction === null ? null : minAgeRestriction,
//         publicationDate: new Date(publicationDate).toISOString()
//     };
//     db.videos[videoIndex] = updatedVideo;
//
//     // 6. Возвращаем статус 204 (No Content)
//     res.status(204).send("No Content");
// }));

videoRouter.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;

    const errors: { message: string; field: string }[] = [];

    const videoId = parseInt(id);
    if (isNaN(videoId) || !Number.isInteger(videoId) || videoId < 1) {
        return res.sendStatus(404);
    }

    const videoIndex = db.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
        return res.sendStatus(404);
    }

// Title
    if (typeof title !== "string") {
        errors.push({ message: "Title is required and must be a string", field: "title" });
    } else {
        const trimmedTitle: string = (title as string).trim(); // 👈 добавляем as string
        if (trimmedTitle.length === 0) {
            errors.push({ message: "Title cannot be empty", field: "title" });
        } else if (trimmedTitle.length > 40) {
            errors.push({ message: "Title must be less than 40 characters", field: "title" });
        }
    }

// Author
    if (typeof author !== "string") {
        errors.push({ message: "Author is required and must be a string", field: "author" });
    } else {
        const trimmedAuthor: string = (author as string).trim(); // 👈 добавляем as string
        if (trimmedAuthor.length === 0) {
            errors.push({ message: "Author cannot be empty", field: "author" });
        } else if (trimmedAuthor.length > 20) {
            errors.push({ message: "Author must be less than 20 characters", field: "author" });
        }
    }


    // --- AvailableResolutions ---
    if (!Array.isArray(availableResolutions)) {
        errors.push({ message: "AvailableResolutions must be an array", field: "availableResolutions" });
    } else if (availableResolutions.some(r => typeof r !== "string" || !VALID_RESOLUTIONS.includes(r as Resolution))) {
        errors.push({ message: "Invalid availableResolutions", field: "availableResolutions" });
    }

    // --- CanBeDownloaded ---
    if (typeof canBeDownloaded !== "boolean") {
        errors.push({ message: "CanBeDownloaded must be a boolean", field: "canBeDownloaded" });
    }

    // --- MinAgeRestriction ---
    if (minAgeRestriction !== null && (typeof minAgeRestriction !== "number" || !Number.isInteger(minAgeRestriction) || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({ message: "MinAgeRestriction must be an integer between 1 and 18 or null", field: "minAgeRestriction" });
    }

    // --- PublicationDate ---
    if (typeof publicationDate !== "string" || isNaN(Date.parse(publicationDate))) {
        errors.push({ message: "PublicationDate must be a valid ISO date string", field: "publicationDate" });
    }

    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }

    // --- Обновление ---
    const updatedVideo: NewVideo = {
        ...db.videos[videoIndex],
        title: title.trim(),
        author: author.trim(),
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate: new Date(publicationDate).toISOString()
    };

    db.videos[videoIndex] = updatedVideo;
    return res.sendStatus(204);
});


videoRouter.delete("/:id", ((req, res) => {
    const id = parseInt(req.params.id);
    // Проверка на валидное целое число
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
        return res.status(404).send("Not Found");
    }
    // Поиск индекса видео по ID
    const videoIndex = db.videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        return res.status(404).send("Not Found");
    }
    // Удаление видео из массива
    db.videos.splice(videoIndex, 1);

    // Отправка статуса 204 (No Content) без тела ответа
    res.status(204).send("No Content");
}));


