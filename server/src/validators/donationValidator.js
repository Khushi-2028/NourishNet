import { body } from "express-validator";

export const createDonationValidation = [

  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description required"),

  body("foodType")
    .notEmpty()
    .withMessage("Food type required"),

  body("quantity")
    .isNumeric()
    .withMessage("Quantity must be numeric"),

  body("pickupAddress")
    .notEmpty()
    .withMessage("Pickup address required"),

  body("preparationTime")
    .notEmpty()
    .withMessage("Preparation time required"),

body("expiryTime")
.custom((value, { req }) => {

    const expiry = new Date(value);

    const preparation =
        new Date(req.body.preparationTime);

    if (expiry <= preparation) {
        throw new Error(
            "Expiry time must be after preparation time."
        );
    }

    if (expiry <= new Date()) {
        throw new Error(
            "Expiry time must be in the future."
        );
    }

    return true;

})

];