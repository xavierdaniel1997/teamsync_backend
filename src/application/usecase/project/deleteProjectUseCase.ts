import { IProjectRepo } from "domain/repositories/projectRepo";
import { IWorkSpaceRepo } from "domain/repositories/workSpaceRepo";

export class DeleteProjectUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private workSpaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(projectId: string, workspaceId: string, userId: string): Promise<void> {

         const workspace = await this.workSpaceRepo.findWorkSpaceByOwner(userId)
        if (!workspace || workspace._id?.toString() !== workspaceId) {
            throw new Error("Workspace not found or user lacks permission");     
        }

        await this.projectRepo.deleteProject(projectId)

    }
}