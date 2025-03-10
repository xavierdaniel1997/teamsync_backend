import { Response } from "express"


export const sendResponse = (
    res: Response,
    statusCode: number,
    data: any,
    message: string
) => {
    const success = statusCode >= 200 && statusCode < 300;
    const response = {success, status: statusCode, message, data}

    return res.status(statusCode).json(response)
}