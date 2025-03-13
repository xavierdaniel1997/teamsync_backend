import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { UpdateProfileUseCase } from "../../../../application/usecase/userProfiles/updateProfileUseCase";

const userRepository = new userRepositoryImp()
const updateProfileUseCase = new UpdateProfileUseCase(userRepository)

const updateProfile = async(req: Request, res: Response):Promise<void> => {
    try{
        const userId = (req as any).user?.userId;
        // console.log("userId is ", (req as any).user)
        if (!userId) {
            throw new Error("Unauthorized: User ID missing");
        }
        const {email, fullName, avatar} = req.body
        const result = await updateProfileUseCase.execute({userId, email, fullName, avatar})
        sendResponse(res, 200, result, "User profile updated successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }

}

export {updateProfile}