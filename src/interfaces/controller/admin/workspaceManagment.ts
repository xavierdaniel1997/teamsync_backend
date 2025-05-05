import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { WorkSpaceRepositoryImp } from "../../../infrastructure/repositories/workSpaceRepositoryImp";
import { WorkspaceManagmentUseCase } from "../../../application/usecase/adminUseCase/workspaceManagmentUseCase";

const workspaceRepo = new WorkSpaceRepositoryImp()
const workspaceManagmentUseCase = new WorkspaceManagmentUseCase(workspaceRepo)

const getAllWorkspaces = async (req: Request, res: Response) => {
    try{
        const workspace = await workspaceManagmentUseCase.execute()
        sendResponse(res, 200, workspace, "Successfully fetch workspaces")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch all workspace")
    }
}

export {getAllWorkspaces}