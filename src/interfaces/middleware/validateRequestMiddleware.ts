import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendResponse } from "../utils/sendResponse";

export const validateRequestMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // res.status(400).json({ errors: errors.array() });
        sendResponse(res, 400, null, errors.array()[0].msg);
        return;
        
    }
    next()
}


