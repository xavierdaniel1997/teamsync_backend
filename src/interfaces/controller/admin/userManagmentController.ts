import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { AdminUserManagmentRepoImp } from "../../../infrastructure/repositories/adminUserManagmentRepoImp"
import { UserManagmentUseCase } from "../../../application/usecase/adminUseCase/userManagmentUseCase"

const adminUserManagmentRepo = new AdminUserManagmentRepoImp()
const userManagmentUseCase = new UserManagmentUseCase(adminUserManagmentRepo)

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try{
        const user = await userManagmentUseCase.execute()
        sendResponse(res, 200, user, "successfull fetch user details")
    }catch(error){
        sendResponse(res, 400, error, "failed to fetch user details")
    }
}

export {getAllUsers}