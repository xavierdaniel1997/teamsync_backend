import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetEpicsByProjectUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private userRepo: IUserRepository
    ) { }

    async execute(projectId: string, userId: string): Promise<ITask[]> {

        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }


        const isMember = project.members.some(
            (member) => member.user._id.toString() === userId
        );
        const isOwner = project.owner._id.toString() === userId;
        if (!isMember && !isOwner) {
            throw new Error("User does not have access to this project");
        }

        const epics = await this.taskRepo.findEpicsByProject(projectId);
        // console.log("epic details", epics)
        return epics;

    }
}