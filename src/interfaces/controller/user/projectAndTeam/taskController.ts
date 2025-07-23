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
import { deleteFromCloudinary, uploadMultipleToCloudinary } from "../../../utils/uploadAssets";
import { UpdateTaskDTO } from "domain/dtos/updateTaskDTO";
import { GetKanbanTaskUseCase } from "../../../../application/usecase/project/getKanbanTaskUseCase";






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
const getKanbanTaskUseCase = new GetKanbanTaskUseCase(sprintRepo, projectRepo, workSpaceRepo, taskRepo)






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

        const { title, status, description, parent, assignee, startDate, endDate, subtasks, webLinks, reporter, type, priority, epicId, sprint } = req.body;

        const parsedSubtasks = subtasks ? JSON.parse(subtasks) : [];
        const parsedWebLinks = webLinks ? JSON.parse(webLinks) : [];

        console.log("req.body form the updateTaskController sprint", sprint)

        // Handle file uploads
        let uploadedFiles: { url: string; publicId: string; fileName: string; fileType: string; size: number }[] = [];
        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
            const uploadOptions = {
                folder: 'TeamSyncAssets/tasks',
                quality: 90,
                resource_type: 'auto' as const,
            };


            const uploadedUrls = await uploadMultipleToCloudinary(files, uploadOptions);
            uploadedFiles = uploadedUrls.map((url, index) => {
                const file = files[index];
                const publicId = url.split('/').pop()?.split('.')[0] || '';
                return {
                    url,
                    publicId,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    size: file.size,
                    uploadedAt: new Date(),
                };
            });
        }

        const existingTask = await taskRepo.findById(taskId);
        if (existingTask?.files?.length && uploadedFiles.length) {
            for (const file of existingTask.files) {
                await deleteFromCloudinary(file.url);
            }
        }

        // console.log("uploaded files from the update task uploadedFiles..", uploadedFiles, "AND REQ.BODY", req.body)

        const updateTaskDTO: UpdateTaskDTO = {
            workspace: workspaceId,
            project: projectId,
            taskId,
            title: title,
            description,
            type,
            status,
            priority,
            assignee: assignee === '' || assignee === 'null' ? null : assignee,
            epicId: epicId === '' || epicId === 'null' ? null : epicId,
            parent,
            sprint: sprint === '' || sprint === 'null' ? null : sprint,
            // sprint,
            files: uploadedFiles.length ? uploadedFiles : undefined,
            startDate,
            endDate,
            subtasks: parsedSubtasks,
            // webLinks: parsedWebLinks,
            webLinks: parsedWebLinks.length ? parsedWebLinks : undefined,
        };

        const updatedTask = await updateTaskUseCase.execute(updateTaskDTO, userId);
        sendResponse(res, 200, updatedTask, "Task updated successfully");


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

//listing task in kanban board
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

const getTaskInKanban = async (req: Request, res: Response): Promise<void> => {
   try{
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
    const task = await getKanbanTaskUseCase.execute(workspaceId, projectId, userId)
    sendResponse(res, 200, null, "successfull fetch the tasks for kanban board with filter")
   }catch(error: any){
    sendResponse(res, 400, null, error.message || "Failed to fetch the task with filter")
   }
}

const updateKanbanTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId, taskId } = req.params;
        sendResponse(res, 200, null, "successfully update the task in kanban board")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to edit the task in kanban board")
    }
}

export {
    createTask,
    getEpicByProject,
    updateTaskController,
    deleteTaskController,
    getTasksController,
    getTaskFromSprint,
    getAllTasksByProject,
    getTaskBySprintStatus,
    getTaskInBoard,
    updateKanbanTask,
    getTaskInKanban
}