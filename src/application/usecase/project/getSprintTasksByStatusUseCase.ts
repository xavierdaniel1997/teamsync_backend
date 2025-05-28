import { SprintStatus } from "../../../domain/entities/sprint";
import { ITask, KanbanStatusGroup, TaskStatus } from "../../../domain/entities/task";
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

    async execute(workspaceId: string, projectId: string, userId: string): Promise<KanbanStatusGroup[]> {
        const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        } 

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }

        const sprints = await this.sprintRepo.findByProject(projectId);

        const activeSprints = sprints.filter((sprint) => sprint.status === SprintStatus.ACTIVE);
        if (activeSprints.length === 0) {
            throw new Error("No active sprints found for this project");
        }


        const allTasks: ITask[] = [];
        for (const sprint of activeSprints) {
            const tasks = await this.sprintRepo.findTasksInSprint(sprint._id!);
            allTasks.push(...tasks);
        }


        const tasksByStatus: KanbanStatusGroup[] = Object.values(TaskStatus).map((status) => ({
            status,
            tasks: [],
        }));

        allTasks.forEach((task) => {
            const statusGroup = tasksByStatus.find((group) => group.status === (task.status || TaskStatus.TO_DO));
            if (statusGroup) {
                statusGroup.tasks.push(task);
            }
        });

        return tasksByStatus;

    }
}