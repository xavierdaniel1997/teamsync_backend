import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { SubscriptionRepositoryImp } from "../../../../infrastructure/repositories/subscriptionRepositoryImp";
import { CreateProjectUseCase } from "../../../../application/usecase/project/createProjectUseCase";
import { PlanRepositoryImp } from "../../../../infrastructure/repositories/planRepositoryImp";
import { InvitationRepoImpl } from "../../../../infrastructure/repositories/invitationRepoImpl";


const projectRepo = new ProjectRepoImpl()
const workspaceRepo = new WorkSpaceRepositoryImp()
const subscriptionRepo = new SubscriptionRepositoryImp()
const planRepo = new PlanRepositoryImp()
const invitationRepo = new InvitationRepoImpl()
const createProjectUseCase = new CreateProjectUseCase(projectRepo, workspaceRepo, subscriptionRepo, planRepo, invitationRepo)

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


export {createProject}