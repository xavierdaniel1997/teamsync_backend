import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ITaskRepositoryImp } from "../../../../infrastructure/repositories/taskRepositoryImp";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { CreateTaskUseCase } from "../../../../application/usecase/project/createTaskUseCase";
import { GetEpicsByProjectUseCase } from "../../../../application/usecase/project/getEpicsByProjectUseCase";

const taskRepo = new ITaskRepositoryImp()
const projectRepo = new ProjectRepoImpl()
const userRepo = new userRepositoryImp()
const workSpaceRepo = new WorkSpaceRepositoryImp()
const createTaskUseCase = new CreateTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo)
const getEpicsByProjectUseCase = new GetEpicsByProjectUseCase(taskRepo, projectRepo, workSpaceRepo, userRepo)

const createTask = async (req: Request, res: Response):Promise<void> => {
    try{
        const userId = (req as any).user?.userId;
        const taskData = req.body;
        const result = await createTaskUseCase.execute(taskData, userId)
        sendResponse(res, 200, null, "successfully created task")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to create task")
    }
}


const getEpicByProject = async (req: Request, res: Response):Promise<void> => {
    try{  
        const userId = (req as any).user?.userId;
        const {projectId} = req.params;
        const result = await getEpicsByProjectUseCase.execute(projectId, userId)
        sendResponse(res, 200, result, "successfull fetch the project epics")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the project epics")
    }
}


const updateTaskController = async (req: Request, res: Response): Promise<void> => {
    try{
        sendResponse(res, 200, null, "successfull updated the task")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to edit the task")
    }
}

export {createTask, getEpicByProject, updateTaskController}