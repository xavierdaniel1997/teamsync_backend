import { IProject } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { ProjectAccessLevel } from "../../../domain/entities/project";

interface GetProjectDetailsDTO {
    projectId: string;
    userId: string; // The user requesting the details (owner or member)
}

export class GetProjectDetailsUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository
    ) {}

    async execute({ projectId, userId }: GetProjectDetailsDTO): Promise<IProject> {
        // Fetch the project with populated references
        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // Check if the user is the owner or a member
        const isOwner = project.owner.toString() === userId;
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (!isOwner && !isMember) {
            throw new Error("User does not have access to this project");
        }

        // Populate additional details (e.g., owner, members, workspace)
        const populatedProject = await this.projectRepo.populateProject(projectId, [
            "owner",
            "members.user",
            "workspace",
        ]);

        return populatedProject;
    }
}