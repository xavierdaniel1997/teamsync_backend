import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetAllTasksByProjectUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(workspaceId: string, projectId: string, userId: string): Promise<ITask[]> {
         const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }

        const tasks = await this.taskRepo.findTaskByProjects(projectId)
        return tasks
    }
}