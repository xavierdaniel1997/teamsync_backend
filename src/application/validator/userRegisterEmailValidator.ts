import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const userEmailValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be a valid email address'),
];