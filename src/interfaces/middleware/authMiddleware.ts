import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyAccessToken } from "../utils/jwtUtils";


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            throw new Error("Unauthorized");
        }
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;
        next();
    }catch(error: any){
        sendResponse(res, 401, null, "Invalid token")
        console.log("error form the auth middleware", error)
    }
}