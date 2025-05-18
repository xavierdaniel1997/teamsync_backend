import { ProjectAccessLevel } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class DeleteTaskUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository,
        private workspaceRepo: IWorkSpaceRepo,
        private sprintRepo: ISprintRepository,
    ) { }

    async execute(workspaceId: string, projectId: string, taskId: string, userId: string): Promise<void> {
        const workspace = await this.workspaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findUserAccess(projectId, userId)
        if (!project) {
            throw new Error("Project not found or user does not have access");
        }
        const isOwner = project.owner.toString() === userId;
        const member = project.members.find((member) => member.user.toString() === userId)

        const hasWriteAccess = isOwner || (member && member.accessLevel === ProjectAccessLevel.WRITE)
        if (!hasWriteAccess) {
            throw new Error("User does not have permission to create tasks");
        }

        const task = await this.taskRepo.findById(taskId)
        if (!task) {
            throw new Error("Task not found")
        }

        if (task.sprint) {
            await this.sprintRepo.update(task.sprint.toString(), { $pull: { tasks: taskId } })
        }

        await this.taskRepo.delete(taskId)
    }
}