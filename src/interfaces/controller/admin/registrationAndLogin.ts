import { Request, Response } from "express";
import { AuthUseCase } from "../../../application/usecase/adminUseCase/authUseCases";
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepositoryImp";
import { sendResponse } from "../../utils/sendResponse";


const adminRepository = new AdminRepositoryImp()
const authUseCase = new AuthUseCase(adminRepository)

const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email, fullName, password, cpassword, role, avatar} = req.body;
        await authUseCase.registerAdmin({email, fullName, password, cpassword, role, avatar})
        sendResponse(res, 200, null, "admin registration successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}


const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await authUseCase.loginAdmin(email, password)
        const { admin, accessToken, refreshToken } = result


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        sendResponse(res, 200, { admin, accessToken }, "user login successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to Login")
    }
}

const adminLogout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        sendResponse(res, 200, null, "Admin logged out successfully");
    } catch (error: any) {
        sendResponse(res, 500, null, "Logout failed");
    }
};

export {register, adminLogin, adminLogout}