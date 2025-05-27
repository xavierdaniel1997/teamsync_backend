import { IProject } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class ListMembersUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(workspaceId: string, projectId: string, userId: string):Promise<IProject>{

        const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }
        const isOwner = project.owner.toString() === userId;
        const member = project.members.find((member) => member.user.toString() === userId)

        const projectMembers = await this.projectRepo.findMembersByProject(projectId)
        console.log("projectMembers details form the listmembers use case", projectMembers)

        return projectMembers;

    }
}