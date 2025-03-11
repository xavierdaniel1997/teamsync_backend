import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { OtpRepositoryImp } from "../../../../infrastructure/repositories/OtpRepositoryImp";
import { SendOTPUseCase } from "../../../../application/usecase/auth/sendOTPUseCase";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { VerifyOtpUseCase } from "../../../../application/usecase/auth/verifyOtpUseCase";
import { RegisterUserUseCase } from "../../../../application/usecase/auth/registerUserUseCase";
import { validationResult } from "express-validator";


const otpRepository  = new OtpRepositoryImp()
const userRepository = new userRepositoryImp()
const sentOtpUsecase = new SendOTPUseCase(userRepository, otpRepository)
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpRepository)
const registerUserUseCase = new RegisterUserUseCase(userRepository)

const sendOtpToEmail = async (req: Request, res: Response) => {
    try{
        const { email } = req.body;
        await sentOtpUsecase.execute(email)
        sendResponse(res, 200, email, "OTP sent successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

const verifyOtp = async (req: Request, res: Response) => {
    try{
        const {email, otpCode} = req.body
        await verifyOtpUseCase.execute(email, otpCode)
        sendResponse(res, 200, email, "OTP verifyed successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Invalid OTP")
    }
}

const resendOtp = async (req: Request, res: Response) => {
    try{
        const { email } = req.body;
        await sentOtpUsecase.execute(email)
        sendResponse(res, 200, email, "OTP re-sent successfully to email accound")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Invalid OTP")
    }
}

const registerUser = async (req: Request, res: Response) => {
    try{   
        const {email, fullName, password, cpassword, role, avatar} = req.body;
        const result = await registerUserUseCase.execute({email, fullName, password, cpassword, role, avatar})
        const {user, accessToken, refreshToken} = result


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", 
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })

        res.setHeader("Authorization", `Bearer ${accessToken}`);

        console.log("result of registerUserUseCase", result)
        sendResponse(res, 200, {email, accessToken}, "user registration complete successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to Register")
    }
}

export {sendOtpToEmail, verifyOtp, resendOtp, registerUser}     