import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ProjectAccessLevel } from "../../../domain/entities/project"
import { ITask } from "../../../domain/entities/task";

export class UpdateKanbanTaskUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private userRepo: IUserRepository,
        private workspaceRepo: IWorkSpaceRepo,
        private sprintRepo: ISprintRepository,
    ) { }

    async execute(workspaceId: string, projectId: string, taskId: string, userId: string, status: string):Promise<ITask> {

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

        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        const isAssigneeTask = task.assignee && task.assignee.toString() === userId;


        if (!hasWriteAccess && !isAssigneeTask) {
            throw new Error("User does not have permission to update this task");
        }
        
        const updateData: any = {
            $set: {

                status: status,

            },

        };
        const updatedtask = await this.taskRepo.update(taskId, updateData)
        if(!updatedtask){
            throw new Error("Failed to update the task")
        }
        console.log("project details form the updateKanbantask.............................", updatedtask)

        return updatedtask
    }
}                                                 