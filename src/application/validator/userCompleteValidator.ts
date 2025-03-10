import { body } from "express-validator"

export const userCompleteValidator = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("fullName")
        .notEmpty()
        .withMessage("Full Name is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("cpassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
]