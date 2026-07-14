import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("role")
    .optional()
    .isIn([
      "donor",
      "ngo",
      "volunteer",
      "admin"
    ])
];

export const loginValidation = [
  body("email").isEmail(),

  body("password").notEmpty()
];