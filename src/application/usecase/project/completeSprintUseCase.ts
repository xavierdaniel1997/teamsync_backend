import { SprintStatus } from "../../../domain/entities/sprint";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ITask, TaskStatus } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class CompleteSprintUseCase {
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
    userId: string,
    moveIncompleteTo: string,
    targetSprintId: string
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

    const sprints = await this.sprintRepo.findById(sprintId);
    if (!sprints) {
      throw new Error("Invalid or inactive sprint");
    }

    if (sprints.status !== SprintStatus.ACTIVE) {
      throw new Error("Only active sprints can be completed");
    }

    // 4. Handle incomplete tasks
    if (moveIncompleteTo === "BACKLOG") {
      await this.taskRepo.updateMany(
        { sprint: sprintId, status: { $ne: TaskStatus.DONE } },
        { sprint: null, status: TaskStatus.TO_DO, taskCompleted: false }
      );
    }

    if (moveIncompleteTo === "TARGET_SPRINT") {
      if (!targetSprintId) {
        throw new Error("Target sprint id is required");
      }

      const targetSprint = await this.sprintRepo.findById(targetSprintId);

      if (!targetSprint) {
        throw new Error("Target sprint not found");
      }

      if (targetSprint.status === SprintStatus.COMPLETED) {
        throw new Error("Cannot move tasks to a completed sprint");
      }

      await this.taskRepo.updateMany(
        { sprint: sprintId, status: { $ne: TaskStatus.DONE } },
        {
          sprint: targetSprintId,
          status: TaskStatus.TO_DO,
          taskCompleted: false,
        }
      );
    }

    // 5. Detach completed tasks
    await this.taskRepo.updateMany(
      { sprint: sprintId, status: TaskStatus.DONE },
      { sprint: null, taskCompleted: true }
    );

    // 6. Complete sprint
    await this.sprintRepo.update(sprintId, {
      status: SprintStatus.COMPLETED,
      endDate: new Date(),
    });
  }
}
