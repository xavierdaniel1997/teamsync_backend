import { CreateTaskDTO } from "../../../domain/dtos/createTaskDTO";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class CreateTaskUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository,
        private workspaceRepo: IWorkSpaceRepo,
        private sprintRepo: ISprintRepository,
    ) { }

    async execute(dto: CreateTaskDTO, userId: string): Promise<ITask> {
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


        const findExistingTitle = await this.taskRepo.findSameTask(dto.project, dto.title)
        console.log("check data form the findExistingTitle", findExistingTitle)
        if(findExistingTitle){
            throw new Error("the task title is already existing")
        }

        const projectTaskCount = await this.projectRepo.incrementTaskCounter(dto.project);
        const taskKey = `SCRUM-${projectTaskCount.taskCounter}`;



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

        if(!task._id){
            throw new Error("task id is not found");
        }

        if (dto.sprint) {
            await this.sprintRepo.addTask(dto.sprint, task._id.toString());
        }
        return task;
    }
}