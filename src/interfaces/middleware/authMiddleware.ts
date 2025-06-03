import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyAccessToken } from "../utils/jwtUtils";
import jwt from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";

interface AuthenticatedUser {
    userId: string;
    role: string;
    fullName: string;
}


interface AuthenticatedSocket extends Socket {
    user?: AuthenticatedUser;
}


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



export const socketAuth = (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            throw new Error("Authentication token missing");
        }
        const decoded = verifyAccessToken(token) as AuthenticatedUser;
        // console.log("decoded user detail from the socketAuth", decoded)
        socket.user = decoded;
        next();
    } catch (error: any) {
        console.log("error from the socket auth middleware", error); 
        next(new Error(error.message || "Invalid token"));
    }
};