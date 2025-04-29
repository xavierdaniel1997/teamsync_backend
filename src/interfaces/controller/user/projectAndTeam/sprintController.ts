import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { SprintRepositoryImp } from "../../../../infrastructure/repositories/sprintRepoImp";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { CreateSprintUseCase } from "../../../../application/usecase/project/createSprintUseCase";
import { GetSprintUseCase } from "../../../../application/usecase/project/getSprintUseCase";


const sprintRepo = new SprintRepositoryImp()
const projectRepo = new ProjectRepoImpl()
const createSprintUseCase = new CreateSprintUseCase(sprintRepo, projectRepo)
const getSprintUseCase = new GetSprintUseCase(sprintRepo, projectRepo)


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
        const {sprintId} = req.params;
        console.log("sprintId", sprintId)
        sendResponse(res, 200, null, "Sprint deleted successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to delete the sprint")
    }
}

export {createSprint, getSprints, deleteSprint}