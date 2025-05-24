import { SprintStatus } from "../../../domain/entities/sprint";
import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetTasksBySprintStatusUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(workspaceId: string, projectId: string, userId: string, status: string): Promise<ITask[]> {

        const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }

        // if (!Object.values(SprintStatus).includes(status)) {
        //     throw new Error("Invalid sprint status");
        // }
        if(!status){
            throw new Error("Invalid sprint status");
        }

        const sprintStatus = status as SprintStatus;
        const tasks = await this.taskRepo.findTasksBySprintStatus(projectId, sprintStatus);
        // console.log("tasks after fetching the find tasks by sprint status in ", tasks)
        return tasks;
    }
}