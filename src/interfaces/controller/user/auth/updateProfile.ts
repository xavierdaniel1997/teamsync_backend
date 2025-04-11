import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { UpdateProfileUseCase } from "../../../../application/usecase/userProfiles/updateProfileUseCase";
import { userDetialUseCase } from "../../../../application/usecase/userProfiles/userDetilasUseCase";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { GetWorkSpaceUseCase } from "../../../../application/usecase/workSpaceUseCase/getWorkSpaceUseCase";
import { GetInvitedWorkspacesUseCase } from "../../../../application/usecase/workSpaceUseCase/getInvitedWorkspacesUseCase";
import { IWorkspace } from "../../../../domain/entities/workSpace";

const userRepository = new userRepositoryImp()
const workspaceRepo = new WorkSpaceRepositoryImp()
const updateProfileUseCase = new UpdateProfileUseCase(userRepository)
const userDetailsUseCase = new userDetialUseCase(userRepository)
const getWorkSpaceUseCase = new GetWorkSpaceUseCase(workspaceRepo)
const getInvitedWorkSpaceUseCase = new GetInvitedWorkspacesUseCase(workspaceRepo, userRepository)

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        // console.log("userId is ", (req as any).user)
        if (!userId) {
            throw new Error("Unauthorized: User ID missing");
        }
        const { email, fullName, avatar } = req.body
        const result = await updateProfileUseCase.execute({ userId, email, fullName, avatar })
        sendResponse(res, 200, result, "User profile updated successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }

}

const getUserDetilas = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const userDetail = await userDetailsUseCase.execute(userId)
        let workspaceOwn = null
        try {
            workspaceOwn = await getWorkSpaceUseCase.execute(userId)
        } catch (error: any) {
            if (error.message === "Workspace not found") {
                workspaceOwn = null;
            } else {
                throw error;
            }
        }
        let invitedWorkspace: IWorkspace[] = [];
        try {
            invitedWorkspace = await getInvitedWorkSpaceUseCase.execute(userId);
        } catch (error: any) {
            if (error.message === "No workspace is found as a member") {
                invitedWorkspace = [];
            } else {
                throw error;
            }
        }
        sendResponse(res, 200, { userDetail, workspaceOwn, invitedWorkspace }, "User profile updated successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

export { updateProfile, getUserDetilas }