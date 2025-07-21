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
import { CreateSprintUseCase } from "../../../../application/usecase/project/createSprintUseCase";
import { SprintRepositoryImp } from "../../../../infrastructure/repositories/sprintRepoImp";
import { UpdateProjectUseCase } from "../../../../application/usecase/project/updateProjectUseCase";
import { deleteFromCloudinary, uploadToCloudinary } from "../../../utils/uploadAssets";
import { InviteTeamMemberUseCase } from "../../../../application/usecase/project/inviteTeamMemberUseCase";
import { DeleteProjectUseCase } from "../../../../application/usecase/project/deleteProjectUseCase";



const projectRepo = new ProjectRepoImpl()
const workspaceRepo = new WorkSpaceRepositoryImp()
const subscriptionRepo = new SubscriptionRepositoryImp()
const planRepo = new PlanRepositoryImp()
const invitationRepo = new InvitationRepoImpl()
const userRepo = new userRepositoryImp()
const sprintRepo = new SprintRepositoryImp()
const createProjectUseCase = new CreateProjectUseCase(projectRepo, workspaceRepo, subscriptionRepo, planRepo, invitationRepo)
const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, workspaceRepo, subscriptionRepo, planRepo, invitationRepo)
const getWorkspaceProjectsUseCase = new GetWorkspaceProjectsUseCase(projectRepo, workspaceRepo, userRepo)
const getSingleProjectUseCase = new GetSingleProjectUseCase(projectRepo, userRepo)
const createSprintUseCase = new CreateSprintUseCase(sprintRepo, projectRepo)
const inviteTeamMemberUseCase = new InviteTeamMemberUseCase(projectRepo, workspaceRepo, subscriptionRepo, planRepo, invitationRepo)
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo, workspaceRepo)

const createProject = async (req: Request, res: Response) => {     
    try {
        const { name, projectkey, title, color, description, workspaceId, emails } = req.body;
        const userId = (req as any).user?.userId;
        const project = await createProjectUseCase.execute({ name, projectkey, title, color, description, workspaceId, userId, emails })
        const projectId = project._id?.toString();
        if (!projectId) {
            throw new Error("Project ID is undefined");
        }
        await createSprintUseCase.execute({
            userId,
            projectId,
            workspaceId,
        });
        sendResponse(res, 200, project, "project created successfully")
    } catch (error: any) {
        console.log(error)
        sendResponse(res, 400, null, error.message || "Failed to create the project",)
    }
}

const updateProject = async (req: Request, res: Response): Promise<void> => {
    console.log("req.body form the updateproject", req.body)
    try {
        const { name, projectkey, description, title, memberId,   
      newAccessLevel, } = req.body;
        const userId = (req as any).user?.userId;
        const { projectId, workspaceId } = req.params;
        let projectCoverImg: string | undefined;
        const existingProject = await projectRepo.findById(projectId)
        if (req.files && (req.files as any).projectCoverImg) {
            // console.log("req.file checking", req.files)
            const coverFile = (req.files as any).projectCoverImg[0];
            if (existingProject?.projectCoverImg) {
                await deleteFromCloudinary(existingProject.projectCoverImg);
            }
            const uploadedResult = await uploadToCloudinary(coverFile, {
                folder: 'TeamSyncAssets',
                width: 1600,
                height: 500,
                quality: 90,
                crop: 'fill',
                resource_type: 'image',
            })
            projectCoverImg = uploadedResult;
           
        }

        const project = await updateProjectUseCase.execute({
            projectId,
            userId,
            workspaceId,
            name,
            projectkey,
            title,
            description,
            projectCoverImg,
            memberId,
      newAccessLevel,
        })
        // console.log("project details from the update project", project)   
        sendResponse(res, 200, project, "project edit successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to edit the project",)
    }
}


const getProjects = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = req.query.workspaceId as string;
    try {
        const userId = (req as any).user?.userId;
        const result = await getWorkspaceProjectsUseCase.execute(workspaceId, userId)
        sendResponse(res, 200, result, "successfull get projects detials")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the projects detials")
    }
}

const getProjectById = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    try {
        const userId = (req as any).user?.userId;
        const result = await getSingleProjectUseCase.execute(userId, projectId)
        sendResponse(res, 200, result, "successfully get project detilas")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the project detials")
    }
}

const getProjectDetails = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    try {
        const userId = (req as any).user?.userId;
        sendResponse(res, 200, userId, "project details fetch successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the project details")
    }
}


const inviteMemberToProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const {projectId, workspaceId} = req.params;
        const {emails} = req.body;
        const userId = (req as any).user?.userId;
        const result = await inviteTeamMemberUseCase.execute(userId, projectId, workspaceId, emails)
        sendResponse(res, 200, null, "successfully invited team member")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "failed to invited team")
    }
}

const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try{
        const {projectId, workspaceId} = req.params;
        console.log("projectId", projectId)
        const userId = (req as any).user?.userId;
        await deleteProjectUseCase.execute(projectId, workspaceId, userId)
        sendResponse(res, 200, null, "successfully deleted the project")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "failed to delete the project")
    }
}
     

export { createProject, updateProject, getProjects, getProjectById, getProjectDetails, inviteMemberToProject, deleteProject }   