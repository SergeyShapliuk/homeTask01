import {VideoInputDto} from "../dto/video.input-dto";
import {ValidationError} from "../types/validationError";
import {Resolution, VALID_RESOLUTIONS} from "../types/video";


export const inputUpdateDtoValidation = (data: VideoInputDto): ValidationError[] => {
    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = data;

    const errors: ValidationError[] = [];

    // Title
    if (typeof title !== "string") {
        errors.push({message: "Title is required and must be a string", field: "title"});
    } else {
        const trimmedTitle: string = (title as string).trim(); // 👈 добавляем as string
        if (trimmedTitle.length === 0) {
            errors.push({message: "Title cannot be empty", field: "title"});
        } else if (trimmedTitle.length > 40) {
            errors.push({message: "Title must be less than 40 characters", field: "title"});
        }
    }

// Author
    if (typeof author !== "string") {
        errors.push({message: "Author is required and must be a string", field: "author"});
    } else {
        const trimmedAuthor: string = (author as string).trim(); // 👈 добавляем as string
        if (trimmedAuthor.length === 0) {
            errors.push({message: "Author cannot be empty", field: "author"});
        } else if (trimmedAuthor.length > 20) {
            errors.push({message: "Author must be less than 20 characters", field: "author"});
        }
    }


    // --- AvailableResolutions ---
    if (!Array.isArray(availableResolutions)) {
        errors.push({message: "AvailableResolutions must be an array", field: "availableResolutions"});
    } else if (availableResolutions.some(r => typeof r !== "string" || !VALID_RESOLUTIONS.includes(r as Resolution))) {
        errors.push({message: "Invalid availableResolutions", field: "availableResolutions"});
    }

    // --- CanBeDownloaded ---
    if (typeof canBeDownloaded !== "boolean") {
        errors.push({message: "CanBeDownloaded must be a boolean", field: "canBeDownloaded"});
    }

    // --- MinAgeRestriction ---
    if (minAgeRestriction !== null && (typeof minAgeRestriction !== "number" || !Number.isInteger(minAgeRestriction) || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({
            message: "MinAgeRestriction must be an integer between 1 and 18 or null",
            field: "minAgeRestriction"
        });
    }

    // --- PublicationDate ---
    if (typeof publicationDate !== "string" || isNaN(Date.parse(publicationDate))) {
        errors.push({message: "PublicationDate must be a valid ISO date string", field: "publicationDate"});
    }

    return errors;
};
