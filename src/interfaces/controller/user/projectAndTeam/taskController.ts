import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ITaskRepositoryImp } from "../../../../infrastructure/repositories/taskRepositoryImp";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { CreateTaskUseCase } from "../../../../application/usecase/project/createTaskUseCase";
import { GetEpicsByProjectUseCase } from "../../../../application/usecase/project/getEpicsByProjectUseCase";
import { GetBacklogTasksUseCase } from "../../../../application/usecase/project/getBacklogTasksUseCase";
import { SprintRepositoryImp } from "../../../../infrastructure/repositories/sprintRepoImp";
import { GetTasksInSprintUseCase } from "../../../../application/usecase/project/getTasksInSprintUseCase";

const taskRepo = new ITaskRepositoryImp()
const projectRepo = new ProjectRepoImpl()
const userRepo = new userRepositoryImp()
const workSpaceRepo = new WorkSpaceRepositoryImp()
const sprintRepo = new SprintRepositoryImp()
const createTaskUseCase = new CreateTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo, sprintRepo)
const getEpicsByProjectUseCase = new GetEpicsByProjectUseCase(taskRepo, projectRepo, workSpaceRepo, userRepo)
const getBacklogTasksUseCase = new GetBacklogTasksUseCase(taskRepo, projectRepo)
const getTasksInSprintUseCase = new GetTasksInSprintUseCase(sprintRepo, projectRepo)

const createTask = async (req: Request, res: Response):Promise<void> => {
    try{
        const userId = (req as any).user?.userId;
        const taskData = req.body;
        const result = await createTaskUseCase.execute(taskData, userId)
        sendResponse(res, 200, result, "successfully created task")
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
    console.log("req.body of the updateTaskController", req.body)
    try{
        const userId = (req as any).user?.userId;
        sendResponse(res, 200, null, "successfull updated the task")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to edit the task")
    }
}
     

const getTasksController = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = (req as any).user?.userId;
        const {projectId} = req.params
        const backlogTasks = await getBacklogTasksUseCase.execute(userId, projectId)
        sendResponse(res, 200, backlogTasks, "successfull fetch the tasks")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the task")
    }
}

const getTaskFromSprint = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = (req as any).user?.userId;
        const {workspaceId, projectId, sprintId} = req.params;
        // console.log("workspaceId, projectId, sprintId", workspaceId, projectId, sprintId)
        const sprintTasks = await getTasksInSprintUseCase.execute(userId, workspaceId, projectId, sprintId)
        sendResponse(res, 200, sprintTasks, "successfull fetch the tasks form sprint")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the task form sprint")
    }
}

export {createTask, getEpicByProject, updateTaskController, getTasksController, getTaskFromSprint}