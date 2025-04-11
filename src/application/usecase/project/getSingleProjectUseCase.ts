import { IProject } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";

export class GetSingleProjectUseCase{
    constructor(
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository
    ){}

    async execute (userId: string, projectId: string):Promise<IProject> {
        const user = await this.userRepo.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const project = await this.projectRepo.findById(projectId);
        console.log("after fetching the project", project)
        if (!project) {
            throw new Error("Project not found");
        }

        const isOwner = project.owner._id.toString() === userId;
        const isMember = project.members.some((member) => member.user._id.toString() === userId);
        if (!isOwner && !isMember) {
            throw new Error("You do not have permission to access this project");
        }

        console.log("project detilas", project)

        return project
    
    } 
}