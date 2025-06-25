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
import { UpdateTaskUseCase } from "../../../../application/usecase/project/updateTaskUseCase";
import { DeleteTaskUseCase } from "../../../../application/usecase/project/deleteTaskUseCase";
import { GetTasksBySprintStatusUseCase } from "../../../../application/usecase/project/getTasksBySprintStatusUseCase";
import { GetAllTasksByProjectUseCase } from "../../../../application/usecase/project/getAllTasksByProjectUseCase";
import { GetSprintTasksByStatusUseCase } from "../../../../application/usecase/project/getSprintTasksByStatusUseCase";
import { INotificationRepoImpl } from "../../../../infrastructure/repositories/notificationRepoImpl";
import { NotificationSocketService } from "../../../../infrastructure/services/notificationSocketService";
import { Server as SocketIOServer } from "socket.io";






const taskRepo = new ITaskRepositoryImp()
const projectRepo = new ProjectRepoImpl()
const userRepo = new userRepositoryImp()
const workSpaceRepo = new WorkSpaceRepositoryImp()
const sprintRepo = new SprintRepositoryImp()
const notificationRepo = new INotificationRepoImpl();

let io: SocketIOServer;
let notificationService: NotificationSocketService;
let updateTaskUseCase: UpdateTaskUseCase;



export const setSocketIO = (socketIO: SocketIOServer) => {
    io = socketIO;
    notificationService = new NotificationSocketService(io);
    updateTaskUseCase = new UpdateTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo, sprintRepo, notificationRepo, notificationService);
};

const createTaskUseCase = new CreateTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo, sprintRepo)
const getEpicsByProjectUseCase = new GetEpicsByProjectUseCase(taskRepo, projectRepo, workSpaceRepo, userRepo)
const getBacklogTasksUseCase = new GetBacklogTasksUseCase(taskRepo, projectRepo)
const getTasksInSprintUseCase = new GetTasksInSprintUseCase(sprintRepo, projectRepo)
// const updateTaskUseCase = new UpdateTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo, sprintRepo)
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo, projectRepo, userRepo, workSpaceRepo, sprintRepo)
const getTasksBySprintStatusUseCase = new GetTasksBySprintStatusUseCase(taskRepo, projectRepo, workSpaceRepo)
const getTasksByProjectUseCaseUseCase = new GetAllTasksByProjectUseCase(taskRepo, projectRepo, workSpaceRepo)
const getSprintTasksByStatusUseCase = new GetSprintTasksByStatusUseCase(sprintRepo, projectRepo, workSpaceRepo, taskRepo)






const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const taskData = req.body;
        const result = await createTaskUseCase.execute(taskData, userId)
        sendResponse(res, 200, result, "successfully created task")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to create task")
    }
}


const getEpicByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { projectId } = req.params;
        const result = await getEpicsByProjectUseCase.execute(projectId, userId)
        sendResponse(res, 200, result, "successfull fetch the project epics")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the project epics")
    }
}



const updateTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId, taskId } = req.params;
        const taskData = { ...req.body, workspace: workspaceId, project: projectId, taskId };
        const task = await updateTaskUseCase.execute(taskData, userId)
        sendResponse(res, 200, task, "successfull updated the task")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to edit the task")
    }
}


const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId, taskId } = req.params;
        await deleteTaskUseCase.execute(workspaceId, projectId, taskId, userId)
        sendResponse(res, 200, null, "successfull delete the task")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to delete the task")
    }
}


const getTasksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { projectId } = req.params

        const backlogTasks = await getBacklogTasksUseCase.execute(userId, projectId)
        sendResponse(res, 200, backlogTasks, "successfull fetch the tasks")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the task")
    }
}

const getTaskFromSprint = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId, sprintId } = req.params;
        // console.log("workspaceId, projectId, sprintId", workspaceId, projectId, sprintId)
        const sprintTasks = await getTasksInSprintUseCase.execute(userId, workspaceId, projectId, sprintId)
        sendResponse(res, 200, sprintTasks, "successfull fetch the tasks form sprint")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the task form sprint")
    }
}

const getAllTasksByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId } = req.params;

        const { assignees, epics } = req.query;

        let assigneesArray: string[] | undefined;
        if (typeof assignees === 'string' && assignees.trim()) {
            assigneesArray = assignees
                .split(',')
                .map(id => id.trim())
                .filter(id => id);
            if (assigneesArray.length === 0) {
                throw new Error('Invalid assignee IDs provided');
            }
        }

        // Parse and validate epics
        let epicsArray: string[] | undefined;
        if (typeof epics === 'string' && epics.trim()) {
            epicsArray = epics
                .split(',')
                .map(id => id.trim())
                .filter(id => id);
            if (epicsArray.length === 0) {
                throw new Error('Invalid epic IDs provided');
            }
        }

        const tasks = await getTasksByProjectUseCaseUseCase.execute(workspaceId, projectId, userId, assigneesArray, epicsArray)
        sendResponse(res, 200, tasks, "successfull fetch the tasks")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "failed fetch the tasks")
    }
}

const getTaskBySprintStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId } = req.params;
        const { status } = req.query;
        if (typeof status !== "string") {
            sendResponse(res, 400, null, "Invalid sprint status");
            return;
        }
        const tasks = await getTasksBySprintStatusUseCase.execute(workspaceId, projectId, userId, status);
        sendResponse(res, 200, tasks, "successfull fetch the tasks form sprint by status")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the task by sprint status")
    }
}

const getTaskInBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId } = req.params;
        const tasks = await getSprintTasksByStatusUseCase.execute(workspaceId, projectId, userId)
        sendResponse(res, 200, tasks, "successfull fetch the tasks for kanban board")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the task")
    }
}

export { createTask, getEpicByProject, updateTaskController, deleteTaskController, getTasksController, getTaskFromSprint, getAllTasksByProject, getTaskBySprintStatus, getTaskInBoard }