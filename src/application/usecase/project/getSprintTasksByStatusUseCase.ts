import { SprintStatus } from "../../../domain/entities/sprint";
import { ITask, TaskStatus } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetSprintTasksByStatusUseCase {
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

        const sprints = await this.sprintRepo.findByProject(projectId);
        const activeSprint = sprints.find((sprint) => sprint.status === SprintStatus.ACTIVE);
        if (!activeSprint) {
            throw new Error('No active sprint found for this project');
        }

        const tasks = await this.sprintRepo.findTasksInSprint(activeSprint._id!);


        const tasksByStatus: Record<TaskStatus, ITask[]> = {
            [TaskStatus.TO_DO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
            [TaskStatus.BLOCKED]: [],
            [TaskStatus.TESTING]: [],
        };

        (tasks as ITask[]).forEach((task) => {
            tasksByStatus[task.status].push(task);
        });


        console.log("task by status", tasksByStatus)

    }
}