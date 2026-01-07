import { TaskStatus } from "../../../domain/entities/task";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class DeleteSprintUseCase {
  constructor(
    private sprintRepo: ISprintRepository,
    private projectRepo: IProjectRepo,
    private taskRepo: ITaskRepository,
    private workspaceRepo: IWorkSpaceRepo
  ) {}

  async execute(
    workspaceId: string,
    projectId: string,
    sprintId: string,
    userId: string
  ): Promise<void> {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const project = await this.projectRepo.findUserAccess(projectId, userId);
    if (!project) {
      throw new Error("Project not found or user does not have access");
    }
    const isOwner = project.owner.toString() === userId;
    const member = project.members.find(
      (member) => member.user.toString() === userId
    );

    const hasWriteAccess =
      isOwner || (member && member.accessLevel === ProjectAccessLevel.WRITE);
    if (!hasWriteAccess) {
      throw new Error("User does not have permission to create tasks");
    }

    const sprint = await this.sprintRepo.findById(sprintId);
    // console.log("sprint details form the deletesprint usecase", sprint)
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // if (sprint.tasks && sprint.tasks.length > 0) {
    //     await this.taskRepo.updateMany(
    //         { _id: { $in: sprint.tasks } },
    //         { sprint: null, updatedAt: new Date() }
    //     );
    // }

    await this.taskRepo.updateMany(
    { sprint: sprintId },
    {
        sprint: null,
        status: TaskStatus.TO_DO,
        updatedAt: new Date(),
    }
);

    await this.sprintRepo.delete(sprintId);
  }
}
