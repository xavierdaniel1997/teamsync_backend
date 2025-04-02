import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { InvitationRepoImpl } from "../../../../infrastructure/repositories/invitationRepoImpl";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { AcceptInvitationUseCase } from "../../../../application/usecase/teamAndInvitations/acceptInvitationUseCase";

const invitationRepo = new InvitationRepoImpl()
const projectRepo = new ProjectRepoImpl()
const workspaceRepo = new WorkSpaceRepositoryImp()
const userRepo = new userRepositoryImp()
const acceptInvitationUseCase = new AcceptInvitationUseCase(invitationRepo, projectRepo, workspaceRepo, userRepo)

const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
    const {token} = req.body;
    const userId = (req as any).user?.userId; 
    // console.log("userId form the acceptInvitation controller", userId)   
    try{
        const result = await acceptInvitationUseCase.execute(token, userId);           
        console.log("result", result)
        if (!result) {
            sendResponse(res, 400, null, "Failed to accept the invitation");
        }

        const { redirectUrl, requiresRegistration, email } = result;

        if (requiresRegistration) {
            sendResponse(res, 200, { redirectUrl, email }, "User needs to register");
        }

        sendResponse(res, 200, { redirectUrl }, "Invitation accepted successfully");
        // sendResponse(res, 200, null, "success")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to accepte the invitation")
    }
}


export {acceptInvitation}