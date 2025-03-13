import { body } from "express-validator"

export const userLoginValidator = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
]