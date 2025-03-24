import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { CreateWorkSpaceUseCase } from "../../../../application/usecase/workSpaceUseCase/createWorkSpaceUseCase";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";

const workSpaceRepositary = new WorkSpaceRepositoryImp()
const createWorkSpaceUseCase = new CreateWorkSpaceUseCase(workSpaceRepositary)

const createWorkSpace = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const {name} = req.body;
        console.log("req.body", req.body.data)
        const newWorkSpace = await createWorkSpaceUseCase.execute(name, userId)
        sendResponse(res, 200, newWorkSpace, "Workspace created successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to Create new workspace")
    }
}

export {createWorkSpace}