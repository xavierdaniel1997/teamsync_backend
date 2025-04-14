import { IProject } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetWorkspaceProjectsUseCase{
    constructor(
        private projectRepo : IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private userRepo: IUserRepository,
    ){}

    async execute(workspaceId: string, userId: string): Promise<IProject[]> {
        const workspace = await this.workspaceRepo.findById(workspaceId)
        if(!workspace){ 
            throw new Error("Workspace not found")
        }

        const user = await this.userRepo.findUserById(userId)
        if(!user){
            throw new Error("User not found");
        }

        const isWorkspaceMember = workspace.members.some((memberId) => memberId.toString() === userId) || workspace.owner.toString() === userId;
        if(!isWorkspaceMember){
            throw new Error("User is not part of this workspace")
        }

        const allProjects = await this.projectRepo.findByWorkspace(workspaceId)
        if(!allProjects){
            throw new Error("Failed to get allprojects")
        }

        const userProjects = allProjects.filter((project: IProject) => {     
            const isOwner = project.owner._id.toString() === userId;
            const isMember = project.members.some((member) => member.user._id.toString() ===
                 userId);
            // console.log(`Project ${project.name}: isOwner=${isOwner}, isMember=${isMember}`);
            return isOwner || isMember;
        });


        return userProjects;

    }
}