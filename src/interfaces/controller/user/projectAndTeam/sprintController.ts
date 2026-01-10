import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { SprintRepositoryImp } from "../../../../infrastructure/repositories/sprintRepoImp";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { CreateSprintUseCase } from "../../../../application/usecase/project/createSprintUseCase";
import { GetSprintUseCase } from "../../../../application/usecase/project/getSprintUseCase";
import { ITaskRepositoryImp } from "../../../../infrastructure/repositories/taskRepositoryImp";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { DeleteSprintUseCase } from "../../../../application/usecase/project/deleteSprintUseCase";
import { StartSprintUseCase } from "../../../../application/usecase/project/startSprintUseCase";
import { Server as SocketIOServer } from "socket.io";
import { INotificationRepoImpl } from "../../../../infrastructure/repositories/notificationRepoImpl";
import { NotificationSocketService } from "../../../../infrastructure/services/notificationSocketService";
import { CreateNotificationUseCase } from "../../../../application/usecase/notificationUseCase/createNotificationUseCase";
import { CompleteSprintUseCase } from "../../../../application/usecase/project/completeSprintUseCase";


const sprintRepo = new SprintRepositoryImp()
const projectRepo = new ProjectRepoImpl()
const taskRepo = new ITaskRepositoryImp()
const workspaceRepo = new WorkSpaceRepositoryImp()
const notificationRepo = new INotificationRepoImpl(); 
const io = new SocketIOServer();  
const notificationService = new NotificationSocketService(io);
const notificationUseCase = new CreateNotificationUseCase(notificationRepo);


const createSprintUseCase = new CreateSprintUseCase(sprintRepo, projectRepo)
const getSprintUseCase = new GetSprintUseCase(sprintRepo, projectRepo)
const deleteSprintUseCase = new DeleteSprintUseCase(sprintRepo, projectRepo, taskRepo, workspaceRepo)
// const startSprintUseCase = new StartSprintUseCase(sprintRepo, projectRepo, taskRepo, workspaceRepo)
const startSprintUseCase = new StartSprintUseCase(sprintRepo, projectRepo, taskRepo, workspaceRepo, notificationUseCase, notificationService);
const completeSprintUseCase = new CompleteSprintUseCase(sprintRepo, projectRepo, taskRepo, workspaceRepo);

const createSprint = async (req: Request, res: Response) => {
    try {
        const { projectId, workspaceId, goal, startDate, endDate } = req.body;
        const userId = (req as any).user?.userId;
        const sprint = await createSprintUseCase.execute({
            userId,
            projectId,
            workspaceId,
            goal,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
          });
        sendResponse(res, 200, null, "successfull created sprint")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to create the sprint")
    }
}


const getSprints = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try{
        const {projectId} = req.params;
        const sprints = await getSprintUseCase.execute(userId, projectId)
        sendResponse(res, 200, sprints, "successfull edit sprint")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to edit the sprint")
    }
}


const deleteSprint = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const {workspaceId, projectId, sprintId} = req.params;
        await deleteSprintUseCase.execute(workspaceId, projectId, sprintId, userId)
        sendResponse(res, 200, null, "Sprint deleted successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to delete the sprint")
    }
}
  
const startSprint = async (req: Request, res: Response) => {
    try{
        console.log("req.body fom the start sprint", req.body)
        const userId = (req as any).user?.userId;
        const {workspaceId, projectId, sprintId} = req.params;
        const sprintData = {...req.body, workspaceId, projectId, sprintId}
        const sprint = await startSprintUseCase.execute(sprintData, userId)
        sendResponse(res, 200, sprint, 'successfull start sprint')
    }catch(error: any){  
        sendResponse(res, 400, null, error.message || "Failed to start sprint")
    }
}   
        

const completeSprint = async (req: Request, res: Response) => {
    try{
        const {moveIncompleteTo, targetSprintId} = req.body;
        const {workspaceId, projectId, sprintId} = req.params;
        const userId = (req as any).user?.userId;
        if(!workspaceId || !projectId || !sprintId){
            throw new Error("workspace , project or sprint _ids are missing")
        }
        const sprints = await completeSprintUseCase.execute(workspaceId, projectId, sprintId, userId, moveIncompleteTo, targetSprintId)
        sendResponse(res, 200, null, "successfully complete the sprint")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to complete sprint")
    }
}
  



export {createSprint, getSprints, deleteSprint, startSprint, completeSprint}  