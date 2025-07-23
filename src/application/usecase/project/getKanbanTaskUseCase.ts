import { IProjectRepo } from "domain/repositories/projectRepo";
import { ISprintRepository } from "domain/repositories/sprintRepo";
import { ITaskRepository } from "domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "domain/repositories/workSpaceRepo";

export class GetKanbanTaskUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private taskRepo: ITaskRepository
    ) { }

    async execute(workspaceId: string, projectId: string, userId: string): Promise<void> {
         const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        } 

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }

        console.log("projectDetail form the getkanbanTaskUseCase", project)
 
    }
}