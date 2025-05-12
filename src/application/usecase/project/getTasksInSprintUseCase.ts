import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";

export class GetTasksInSprintUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projectRepo: IProjectRepo,
    ) { }

    async execute(userId: string, workspaceId: string, projectId: string, sprintId: string): Promise<ITask[]> {

        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        if (project.workspace._id.toString() !== workspaceId) {
            throw new Error("Workspace does not match project");
        }

        const isOwner = project.owner._id.toString() === userId;
        const member = project.members.find(
            (member) => member.user._id.toString() === userId
        );
        const hasAccess =
            isOwner ||
            (member &&
                [ProjectAccessLevel.READ, ProjectAccessLevel.WRITE].includes(
                    member.accessLevel
                ));

        if (!hasAccess) {
            throw new Error("User does not have permission to view tasks");
        }

        const sprint = await this.sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new Error("Sprint not found");
        }

        
        if (sprint.project.toString() !== projectId) {
            throw new Error("Sprint does not belong to the specified project");
        }
        
        const tasks = await this.sprintRepo.findTasksInSprint(sprintId);
        // console.log("project task details form the task sprint use case", tasks)

        return tasks;

    }
}