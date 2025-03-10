import { Request, Response, NextFunction } from "express";
import { AppError } from "../../application/usecase/errors/appError";
import { sendResponse } from "../utils/sendResponse";


const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void  => {
    console.log("Error", err)

    if(err instanceof AppError){
        sendResponse(res, err.statusCode, null, err.message);
    }

    sendResponse(res, 500, null, "Internal Server Error")
}

export default errorMiddleware;



