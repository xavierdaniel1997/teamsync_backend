import { CreateTaskDTO } from "../../../domain/dtos/createTaskDTO";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class CreateTaskUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository,
        private workspaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(dto: CreateTaskDTO, userId: string): Promise<ITask> {
        // console.log("this is also form the create task use case dto.project", dto.project)

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

        // console.log("this is from the create task use case dto.project", dto.project)
        const projectTaskCount = await this.projectRepo.incrementTaskCounter(dto.project);
        const taskKey = `SCRUM-${projectTaskCount.taskCounter}`;
        // console.log("this is also from the task create use case projectTaskCount result", projectTaskCount)


        const taskData: Partial<ITask> = {
            project: dto.project,
            workspace: dto.workspace,
            taskKey: taskKey,
            title: dto.title,
            description: dto.description,
            type: dto.type,
            status: dto.status || undefined,
            priority: dto.priority || undefined,
            assignee: dto.assignee || undefined,
            reporter: userId,
            epic: dto.epic || undefined,
            parent: dto.parent || undefined,
            sprint: dto.sprint || undefined,
            storyPoints: dto.storyPoints,
            files: dto.files || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const task = await this.taskRepo.create(taskData)
        return task;
        // console.log("created task", task)
    }
}