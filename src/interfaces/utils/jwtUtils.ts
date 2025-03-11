import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;


export const generateAccessToken = (userId: string, role: string, fullName: string) => {
    return jwt.sign({ userId, role, fullName },
        ACCESS_SECRET,
        { expiresIn: "15m" }

    )
} 

export const generateRefreshToken = (userId: string, role: string, fullName: string) => {
    return jwt.sign({userId, role, fullName},
        REFRESH_SECRET,
        {expiresIn: "2d"}
    )
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET);
  };
  
  export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
  };