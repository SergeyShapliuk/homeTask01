import {body} from "express-validator";

const URL_PATTERN =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body("name")
    .isString()
    .withMessage("name should be string")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({max: 15})
    .withMessage("Length of name is not correct");

const descriptionValidation = body("description")
    .isString()
    .withMessage("name should be string")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({max: 500})
    .withMessage("Length of name is not correct");

const websiteUrlValidation = body("websiteUrl")
    .isString()
    .withMessage("name should be string")
    .trim()
    .notEmpty()
    .withMessage("websiteUrl is required")
    .isLength({max: 100})
    .withMessage("Length of name is not correct")
    .matches(URL_PATTERN)
    .withMessage(
        "URL должен быть в формате: https://example.com или https://sub.example.com/path"
    );
// const phoneNumberValidation = body('phoneNumber')
//     .isString()
//     .withMessage('phoneNumber should be string')
//     .trim()
//     .isLength({ min: 8, max: 15 })
//     .withMessage('Length of phoneNumber is not correct');
//
// const emailValidation = body('email')
//     .isString()
//     .withMessage('email should be string')
//     .trim()
//     .isLength({ min: 5, max: 100 })
//     .withMessage('Length of email is not correct')
//     .isEmail();
//
// const vehicleMakeValidation = body('vehicleMake')
//     .isString()
//     .withMessage('vehicleMake should be string')
//     .trim()
//     .isLength({ min: 3, max: 100 })
//     .withMessage('Length of vehicleMake is not correct');
//
// const vehicleModelValidation = body('vehicleModel')
//     .isString()
//     .withMessage('vehicleModel should be string')
//     .trim()
//     .isLength({ min: 2, max: 100 })
//     .withMessage('Length of vehicleModel is not correct');
//
// // Получаем текущий год
// const currentYear = new Date().getFullYear();
// const vehicleYearValidation = body('vehicleYear')
//     .isInt({ min: 1980, max: currentYear })
//     .withMessage('vehicleModel should be real year');
//
// const vehicleLicensePlateValidation = body('vehicleLicensePlate')
//     .isString()
//     .withMessage('vehicleLicensePlate should be string')
//     .trim()
//     .isLength({ min: 6, max: 10 })
//     .withMessage('Length of vehicleLicensePlate is not correct');
//
// const vehicleDescriptionValidation = body('vehicleDescription')
//     .optional({ nullable: true }) // Позволяет значению быть null
//     .isString()
//     .withMessage('vehicleDescription should be string')
//     .trim()
//     .isLength({ min: 10, max: 200 })
//     .withMessage('Length of vehicleDescription is not correct');
//
// const vehicleFeaturesValidation = body('vehicleFeatures')
//     .isArray()
//     .withMessage('vehicleFeatures should be array')
//     .optional() // Позволяет массиву быть пустым
//     .custom((vehicleFeatures: Array<VehicleFeature>) => {
//         if (vehicleFeatures.length) {
//             const validFeatures = Object.values(VehicleFeature);
//
//             vehicleFeatures.forEach((feature) => {
//                 if (!validFeatures.includes(feature)) {
//                     throw new Error('vehicleFeatures should contain values of VehicleFeature');
//                 }
//             });
//         }
//         return true;
//     });

export const blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
    // phoneNumberValidation,
    // emailValidation,
    // vehicleMakeValidation,
    // vehicleModelValidation,
    // vehicleYearValidation,
    // vehicleLicensePlateValidation,
    // vehicleDescriptionValidation,
    // vehicleFeaturesValidation,
];
