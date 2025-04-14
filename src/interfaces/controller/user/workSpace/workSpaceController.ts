import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { CreateWorkSpaceUseCase } from "../../../../application/usecase/workSpaceUseCase/createWorkSpaceUseCase";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { GetWorkSpaceUseCase } from "../../../../application/usecase/workSpaceUseCase/getWorkSpaceUseCase";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { GetInvitedWorkspacesUseCase } from "../../../../application/usecase/workSpaceUseCase/getInvitedWorkspacesUseCase";

const workSpaceRepositary = new WorkSpaceRepositoryImp()
const userRepo = new userRepositoryImp()
const createWorkSpaceUseCase = new CreateWorkSpaceUseCase(workSpaceRepositary)
const getWorkSpaceUseCase = new GetWorkSpaceUseCase(workSpaceRepositary)
const getInvitedWorkSpaceUseCase = new GetInvitedWorkspacesUseCase(workSpaceRepositary, userRepo)


const createWorkSpace = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const {name} = req.body;
        // console.log("req.body", req.body.data)
        const newWorkSpace = await createWorkSpaceUseCase.execute(name, userId)
        sendResponse(res, 200, {workspaceId: newWorkSpace._id}, "Workspace created successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to Create new workspace")
    }
}

const getWorkSpace = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const workspace = await getWorkSpaceUseCase.execute(userId)
        sendResponse(res, 200, workspace, "Data fetch successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the workspace")
    }
}


const getInvitedWorkSpace = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const result = await getInvitedWorkSpaceUseCase.execute(userId)
        sendResponse(res, 200, null, "Data fetch successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the workspace")
    }
}

export {createWorkSpace, getWorkSpace, getInvitedWorkSpace}