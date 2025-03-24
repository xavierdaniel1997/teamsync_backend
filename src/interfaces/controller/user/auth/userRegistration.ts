import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { OtpRepositoryImp } from "../../../../infrastructure/repositories/OtpRepositoryImp";
import { SendOTPUseCase } from "../../../../application/usecase/auth/sendOTPUseCase";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { VerifyOtpUseCase } from "../../../../application/usecase/auth/verifyOtpUseCase";
import { RegisterUserUseCase } from "../../../../application/usecase/auth/registerUserUseCase";
import { validationResult } from "express-validator";
import { LoginUserUseCase } from "../../../../application/usecase/auth/loginUserUseCase";
import { ForgotPasswordUseCase } from "../../../../application/usecase/auth/forgotPasswordUseCase";
import { RefreshTokenUseCase } from "../../../../application/usecase/auth/refreshTokenUseCase";
import { GoogleLoginUseCase } from "../../../../application/usecase/auth/googleLoginUseCase";



const otpRepository = new OtpRepositoryImp()
const userRepository = new userRepositoryImp()
const sentOtpUsecase = new SendOTPUseCase(userRepository, otpRepository)
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpRepository)
const registerUserUseCase = new RegisterUserUseCase(userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, otpRepository)
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository)
const googleLoginUseCase = new GoogleLoginUseCase(userRepository)

const sendOtpToEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        await sentOtpUsecase.execute(email)
        sendResponse(res, 200, email, "OTP sent successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otpCode } = req.body
        await verifyOtpUseCase.execute(email, otpCode)
        sendResponse(res, 200, email, "OTP verifyed successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Invalid OTP")
    }
}

const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        await sentOtpUsecase.execute(email)
        sendResponse(res, 200, email, "OTP re-sent successfully to email accound")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Invalid OTP")
    }
}

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, fullName, password, cpassword, role, avatar } = req.body;
        const result = await registerUserUseCase.execute({ email, fullName, password, cpassword, role, avatar })
        const { user, accessToken, refreshToken } = result


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        sendResponse(res, 200, { user, accessToken }, "user registration complete successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to Register")
    }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log("login data", req.body)
        const result = await loginUserUseCase.execute({ email, password })
        const { userData, accessToken, refreshToken } = result


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        sendResponse(res, 200, { userData, accessToken }, "user login successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to Login")
    }
}

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        sendResponse(res, 200, null, "User logged out successfully");
    } catch (error: any) {
        sendResponse(res, 500, null, "Logout failed");
    }
};

// const forgotPassword = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;
//         await forgotPasswordUseCase.forgotPswOtp(email)
//         sendResponse(res, 200, null, "OTP sent successfully")
//     } catch (error: any) {
//         sendResponse(res, 400, null, error.message || "Something went wrong")
//     }
// }

// const resetPassword = async(req: Request, res: Response) => {
//     try{
//         const {email, newPassword, cpassword} = req.body;
//         await forgotPasswordUseCase.resetPasswrod(email, newPassword, cpassword)
//         sendResponse(res, 200, null, "Password reset successfully") 
//     }catch(error: any){
//         sendResponse(res, 400, null, error.message || "Something went wrong")
//     }
// }

const forgetPswViaEmail = async(req: Request, res: Response): Promise<void> => {
    try{
        const {email} = req.body;
        await forgotPasswordUseCase.forgotPassword(email)    
        sendResponse(res, 200, null, "verify the link send to the email")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

const resetPassword = async(req: Request, res: Response):Promise<void> => {
    try{
        const { token, } = req.params  
        const {email , newPassword, cpassword } = req.body; 
        console.log("resetpasswrod", req.body, token)
        // if (!token || !email) {
        //      res.status(400).json({ message: "Token and email are required" });
        //      return 
        // }
        await forgotPasswordUseCase.resetPswEmail(email as string, token as string, newPassword, cpassword)
        sendResponse(res, 200, null, "Password reset successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}


const refreshAccessToken = async(req: Request, res: Response):Promise<void> => {
    try{
        const refreshToken = req.cookies.refreshToken;
        const {accessToken} = await refreshTokenUseCase.execute(refreshToken)
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        sendResponse(res, 200, { accessToken }, "Access token refreshed");
    }catch(error: any){
        sendResponse(res, 403, null, error.message || "Failed to refresh token");
    }
}


const googleLogin = async(req: Request, res: Response): Promise<void> => {
    try{
        const { access_token } = req.body;
        // console.log("googleLogin", req.body) 
        if (!access_token) throw new Error("Access token not provided");
        const result = await googleLoginUseCase.execute(access_token)
        const {user, refreshToken, accessToken} = result;
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        sendResponse(res, 200, { user, accessToken }, "user login successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to Login")
    }

}

export { sendOtpToEmail, verifyOtp, resendOtp, registerUser, loginUser, logoutUser, resetPassword, forgetPswViaEmail, refreshAccessToken, googleLogin}     