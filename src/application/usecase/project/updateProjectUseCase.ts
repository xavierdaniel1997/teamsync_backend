import { ProjectDTO } from "../../../domain/dtos/projectDTO";
import { IProject, ProjectAccessLevel } from "../../../domain/entities/project";
import { IInvitationRepo } from "../../../domain/repositories/invitationRepo";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class UpdateProjectUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private workSpaceRepo: IWorkSpaceRepo,
        private subscriptionRepo: ISubscriptionRepo,
        private planRepo: IPlanRepository,
        private invitationRepo: IInvitationRepo
    ) { }

    async execute(projectData: ProjectDTO): Promise<IProject> {
        const { projectId, userId, workspaceId, name, projectkey, title, description, projectCoverImg, memberId, newAccessLevel } = projectData;

        if (!workspaceId || !projectId) {
            throw new Error("WorkspaceId or ProjectId is undefined");
        }
        const workspace = await this.workSpaceRepo.findWorkSpaceByOwner(userId)
        if (!workspace || workspace._id?.toString() !== workspaceId) {
            throw new Error("Workspace not found or user lacks permission");
        }

        const subscription = await this.subscriptionRepo.findByWorkspace(workspaceId);
        if (!subscription || !subscription.plan) {
            throw new Error("No active subscription found");
        }

        const planId = subscription.plan as any;
        const plan = await this.planRepo.findById(planId);
        if (!plan) {
            throw new Error("Plan not found");
        }

        const project = await this.projectRepo.findUserAccess(projectId, userId);
        if (!project) {
            throw new Error("Project not found or user lacks permission");
        }


        const userAccess = project.members.find(member => member.user.toString() === userId)?.accessLevel ||
            (project.owner.toString() === userId ? ProjectAccessLevel.OWNER : ProjectAccessLevel.NONE);
        if (userAccess !== ProjectAccessLevel.OWNER && userAccess !== ProjectAccessLevel.WRITE) {
            throw new Error("User does not have WRITE or OWNER access to update the project");
        }


        if (memberId && newAccessLevel) {
            const updatedProjectWithMember = await this.projectRepo.updateMemberAccessLevel(
                projectId,
                memberId,
                newAccessLevel as ProjectAccessLevel
            );
            if (!updatedProjectWithMember) {
                throw new Error("Failed to update member access level");
            }
            return updatedProjectWithMember;
        }


        const updateData: Partial<IProject> = {};
        if (name) updateData.name = name;
        if (projectkey) updateData.projectkey = projectkey;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (projectCoverImg !== undefined) updateData.projectCoverImg = projectCoverImg;


        const updatedProject = await this.projectRepo.update(projectId, updateData);
        if (!updatedProject) {
            throw new Error("Failed to update project");
        }
        console.log("updatedProject", updatedProject)
        return updatedProject;
    }
}     