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

export {register}