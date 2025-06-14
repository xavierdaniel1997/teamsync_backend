import { UpdateTaskDTO } from "../../../domain/dtos/updateTaskDTO";
import { INotification, NotificationStatus } from "../../../domain/entities/notification";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ITask } from "../../../domain/entities/task";
import { INotificationRepo } from "../../../domain/repositories/notificationRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { NotificationService } from "../../../domain/services/notificationService";
import { CreateNotificationUseCase } from "../notificationUseCase/createNotificationUseCase";


export class UpdateTaskUseCase {
    private notificationUseCase: CreateNotificationUseCase;
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository,
        private workspaceRepo: IWorkSpaceRepo,
        private sprintRepo: ISprintRepository,
        private notificationRepo: INotificationRepo,
        private notificationService: NotificationService
    ) {
        this.notificationUseCase = new CreateNotificationUseCase(notificationRepo);
    }

    async execute(dto: UpdateTaskDTO, userId: string): Promise<ITask> {
        const workspace = await this.workspaceRepo.findById(dto.workspace);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findUserAccess(dto.project, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }
        const isOwner = project.owner.toString() === userId;
        const member = project.members.find((member) => member.user.toString() === userId)

        const hasWriteAccess = isOwner || (member && member.accessLevel === ProjectAccessLevel.WRITE)

        if (!hasWriteAccess) {
            throw new Error("User does not have permission to create tasks");
        }

        const existingTask = await this.taskRepo.findById(dto.taskId);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        const existingDuplicate = await this.taskRepo.findSameTaskExcludingId(dto.project, dto.title || "", dto.taskId)
        if (existingDuplicate) {
            throw new Error("Another task with the same title already exists in this project");
        }



        const taskData: Partial<ITask> = {
            title: dto.title,
            description: dto.description,
            type: dto.type,
            status: dto.status,
            priority: dto.priority,
            assignee: dto.assignee,
            epic: dto.epicId,
            parent: dto.parent,
            sprint: dto.sprint,
            storyPoints: dto.storyPoints,
            //   files: dto.files,
            updatedAt: new Date(),
        };



        (Object.keys(taskData) as (keyof ITask)[]).forEach(
            (key) => taskData[key] === undefined && key !== 'sprint' && delete taskData[key]
        );

        if (dto.sprint !== undefined && dto.sprint !== existingTask.sprint) {
            if (existingTask.sprint && !dto.sprint) {
                console.log(`Removing task ${dto.taskId} from sprint ${existingTask.sprint}`);
                await this.sprintRepo.update(existingTask.sprint.toString(), {
                    $pull: { tasks: dto.taskId },
                });
            }

            else if (!existingTask.sprint && dto.sprint) {
                const sprint = await this.sprintRepo.findById(dto.sprint);
                if (!sprint) {
                    throw new Error("Target sprint not found");
                }
                await this.sprintRepo.addTask(dto.sprint, dto.taskId);
            }

            else if (existingTask.sprint && dto.sprint && existingTask.sprint.toString() !== dto.sprint) {
                await this.sprintRepo.update(existingTask.sprint.toString(), {
                    $pull: { tasks: dto.taskId },
                });
                const sprint = await this.sprintRepo.findById(dto.sprint);
                if (!sprint) {
                    throw new Error("Target sprint not found");
                }
                await this.sprintRepo.addTask(dto.sprint, dto.taskId);
            }
        }


        const updatedTask = await this.taskRepo.update(dto.taskId, taskData);
        if (!updatedTask) {
            throw new Error("Failed to update task");
        }

        // Trigger notifications for assignee changes
        if (dto.assignee !== existingTask.assignee?.toString()) {
            // Notify previous assignee about unassignment if they exist and are not the user performing the update
            if (existingTask.assignee && existingTask.assignee.toString() !== userId) {
                const unassignNotification = await this.notificationUseCase.execute(
                    existingTask.assignee.toString(),
                    "Task Unassigned",
                    `You have been unassigned from task ${updatedTask.taskKey} task named ${updatedTask.title} in the project ${updatedTask.project.name} By ${updatedTask.reporter.fullName}
                    check your board for more updates`,
                    "description",
                    updatedTask.reporter.fullName,
                    "Task Unassignment",
                    dto.taskId,
                    dto.project,
                    "TASK_UNASSIGNED",
                    NotificationStatus.INFO
                );
                this.notificationService.notifyUser(unassignNotification);
            }

            // Notify new assignee about assignment if they exist and are not the user performing the update
            if (dto.assignee && dto.assignee !== userId) {
                const assignNotification = await this.notificationUseCase.execute(
                    dto.assignee,
                    "Task Assigned",
                    `You have been assigned to task ${updatedTask.taskKey} task named ${updatedTask.title} in the project ${updatedTask.project.name} By ${updatedTask.reporter.fullName}  
                    to start you work navigate to your backlog or board to seen the task`,
                    "description",
                    updatedTask.reporter.fullName,
                    "Task Assignment",
                    dto.taskId,
                    dto.project,
                    "TASK_ASSIGNED",
                    NotificationStatus.WARNING
                );
                this.notificationService.notifyUser(assignNotification);
            }
        }

        return updatedTask;

    }
}