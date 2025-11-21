import { ITask, KanbanStatusGroup, TaskStatus } from "../../../domain/entities/task";
import { ISprint, SprintStatus } from "../../../domain/entities/sprint";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetKanbanTaskUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private taskRepo: ITaskRepository
    ) { }

    async execute(workspaceId: string, projectId: string, userId: string, assignees?: string[], epics?: string[]): Promise<KanbanStatusGroup[]> {
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

        // console.log("projectDetail form the getkanbanTaskUseCase", activeSprints)   

    const allTasks: ITask[] = [];

        for (const sprint of activeSprints) {
            const tasks = await this.sprintRepo.findFilterTaskInsprint(sprint._id!, assignees, epics);
            console.log("tasksssssssssssssssfrom ", tasks)
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