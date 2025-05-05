import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { UpdateProfileUseCase } from "../../../../application/usecase/userProfiles/updateProfileUseCase";
import { userDetialUseCase } from "../../../../application/usecase/userProfiles/userDetilasUseCase";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { GetWorkSpaceUseCase } from "../../../../application/usecase/workSpaceUseCase/getWorkSpaceUseCase";
import { GetInvitedWorkspacesUseCase } from "../../../../application/usecase/workSpaceUseCase/getInvitedWorkspacesUseCase";
import { IWorkspace } from "../../../../domain/entities/workSpace";
import { deleteFromCloudinary, uploadToCloudinary } from "../../../utils/uploadAssets";

const userRepository = new userRepositoryImp()
const workspaceRepo = new WorkSpaceRepositoryImp()
const updateProfileUseCase = new UpdateProfileUseCase(userRepository)
const userDetailsUseCase = new userDetialUseCase(userRepository)
const getWorkSpaceUseCase = new GetWorkSpaceUseCase(workspaceRepo)
const getInvitedWorkSpaceUseCase = new GetInvitedWorkspacesUseCase(workspaceRepo, userRepository)

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            throw new Error("Unauthorized: User ID missing");
        }
        const existingUser = await userRepository.findUserById(userId);
        const { email, fullName, secondName } = req.body
        const updateData: any = { userId, email, fullName, secondName };
        if (req.files && (req.files as any).avatar) {
            const avatarFile = (req.files as any).avatar[0];
            if (existingUser?.avatar) {
                await deleteFromCloudinary(existingUser.avatar);
            }
            updateData.avatar = await uploadToCloudinary(avatarFile, {
                folder: 'TeamSyncAssets',
                width: 400,
                height: 400,
                quality: 90,
                crop: 'fill',
                resource_type: 'image',
            });
        }

        if (req.files && (req.files as any).coverPhoto) {
            const coverFile = (req.files as any).coverPhoto[0];
            if (existingUser?.coverPhoto) {
                await deleteFromCloudinary(existingUser.coverPhoto);
            }
            updateData.coverPhoto = await uploadToCloudinary(coverFile, {
                folder: 'TeamSyncAssets',
                width: 1600,
                height: 500,
                quality: 90,
                crop: 'fill',
                resource_type: 'image',
            })
        }
        const result = await updateProfileUseCase.execute(updateData)
        sendResponse(res, 200, null, "User profile updated successfully")
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