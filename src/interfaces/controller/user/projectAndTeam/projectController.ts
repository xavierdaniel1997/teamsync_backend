import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { SubscriptionRepositoryImp } from "../../../../infrastructure/repositories/subscriptionRepositoryImp";
import { CreateProjectUseCase } from "../../../../application/usecase/project/createProjectUseCase";
import { PlanRepositoryImp } from "../../../../infrastructure/repositories/planRepositoryImp";
import { InvitationRepoImpl } from "../../../../infrastructure/repositories/invitationRepoImpl";
import { userRepositoryImp } from "../../../../infrastructure/repositories/userRepositoryImp";
import { GetWorkspaceProjectsUseCase } from "../../../../application/usecase/project/getWorkspaceProjectsUseCase";
import { GetSingleProjectUseCase } from "../../../../application/usecase/project/getSingleProjectUseCase";


const projectRepo = new ProjectRepoImpl()
const workspaceRepo = new WorkSpaceRepositoryImp()
const subscriptionRepo = new SubscriptionRepositoryImp()
const planRepo = new PlanRepositoryImp()
const invitationRepo = new InvitationRepoImpl()
const userRepo = new userRepositoryImp()
const createProjectUseCase = new CreateProjectUseCase(projectRepo, workspaceRepo, subscriptionRepo, planRepo, invitationRepo)
const getWorkspaceProjectsUseCase = new GetWorkspaceProjectsUseCase(projectRepo, workspaceRepo, userRepo)
const getSingleProjectUseCase = new GetSingleProjectUseCase(projectRepo, userRepo)

const createProject = async (req: Request, res: Response) => {
    try{
        const {name, projectkey, description, workspaceId, emails} = req.body;
        const userId = (req as any).user?.userId;
        const project = await createProjectUseCase.execute({name, projectkey, description, workspaceId, userId, emails})
        sendResponse(res, 200, project, "project created successfully")   
    }catch(error: any){
        console.log(error)
        sendResponse(res, 400, null, error.message || "Failed to create the project",)
    }
}


const getProjects = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = req.query.workspaceId as string;
    // const {workspaceId} = req.body;
    // console.log("workspace data form req.body", req.body) 
    try{
        const userId = (req as any).user?.userId;
        const result = await getWorkspaceProjectsUseCase.execute(workspaceId, userId)
        sendResponse(res, 200, result, "successfull get projects detials")
    }catch(error: any){ 
        sendResponse(res, 400, null, error.message ||"Failed to fetch the projects detials")
    }
}

const getProjectById = async (req: Request, res: Response): Promise<void> => {
    const {projectId} = req.params;
    try{
        const userId = (req as any).user?.userId;
        const result = await getSingleProjectUseCase.execute(userId, projectId)
        // console.log("result of getProjectById from the project controller", result)
        sendResponse(res, 200, result, "successfully get project detilas")
    }catch(error: any){
        sendResponse(res, 400, null, error.message ||"Failed to fetch the project detials")
    }
}

const getProjectDetails = async (req: Request, res: Response): Promise<void> => {
    const {projectId} = req.params;
    try{
        const userId = (req as any).user?.userId;
        sendResponse(res, 200, userId, "project details fetch successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the project details")
    }
}


export {createProject, getProjects, getProjectById, getProjectDetails}