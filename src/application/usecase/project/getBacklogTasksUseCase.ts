import { ITask } from "../../../domain/entities/task";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";

export class GetBacklogTasksUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private projectRepository: IProjectRepo
    ) {}

    async execute(userId: string, projectId: string): Promise<ITask[]> {
        if (!userId || !projectId) {
            throw new Error("User ID and Project ID are required");
        }

        const project = await this.projectRepository.findUserAccess(projectId, userId);
        if (!project) {
            throw new Error("Unauthorized access to project");
        }
        console.log("checking the access of project form the getbacklogTasksUsecase", project)

        const tasks = await this.taskRepository.findBacklogTasks(projectId);
        return tasks;
    }
}