import { UpdateSprintDTO } from "../../../domain/dtos/createSprintDTO";
import { NotificationStatus } from "../../../domain/entities/notification";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ISprint, SprintStatus } from "../../../domain/entities/sprint";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { NotificationService } from "../../../domain/services/notificationService";
import { CreateNotificationUseCase } from "../notificationUseCase/createNotificationUseCase";

export class StartSprintUseCase {
  constructor(
    private sprintRepo: ISprintRepository,
    private projectRepo: IProjectRepo,
    private taskRepo: ITaskRepository,
    private workspaceRepo: IWorkSpaceRepo,
    private notificationUseCase: CreateNotificationUseCase,
    private notificationService: NotificationService
  ) {}

  async execute(dto: UpdateSprintDTO, userId: string): Promise<ISprint> {
    const {
      workspaceId,
      projectId,
      sprintId,
      sprintName,
      duration,
      sprintGoal,
      startDate,
      endDate,
    } = dto;
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
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // 🔴 CRITICAL CHECK — ONLY ONE ACTIVE SPRINT PER PROJECT
    const activeSprint = await this.sprintRepo.findActiveSprintByProject(
      projectId
    );

    console.log("checking the active sprint is running.................", activeSprint)

    if (activeSprint && activeSprint._id && activeSprint._id.toString() !== sprintId) {
      throw new Error(
        `Sprint "${activeSprint.sprintName}" is already active. Complete it before starting a new sprint.`
      );
    }

    // 🔒 State transition validation
    if (sprint.status !== SprintStatus.PLANNED) {
      throw new Error("Only PLANNED sprints can be started");
    }

    const now = new Date();
    const effectiveStartDate = startDate ? new Date(startDate) : now;        
    let effectiveEndDate: Date;

    if (endDate) {
      effectiveEndDate = new Date(endDate);
    } else if (duration) {      
      const durationInWeeks = parseInt(duration, 10);
      if (isNaN(durationInWeeks) || durationInWeeks <= 0) {
        throw new Error("Invalid duration");
      }
      effectiveEndDate = new Date(effectiveStartDate);
      effectiveEndDate.setDate(
        effectiveStartDate.getDate() + durationInWeeks * 7
      );
    } else {
      throw new Error("End date or duration must be provided");
    }

    if (effectiveStartDate >= effectiveEndDate) {
      throw new Error("End date must be after start date");
    }

    const updates = {
      status: SprintStatus.ACTIVE,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      sprintName,
      goal: sprintGoal,
      updatedAt: now,
    };

    const updatedSprint = await this.sprintRepo.update(sprintId, updates);
    if (!updatedSprint) {
      throw new Error("Failed to update sprint");
    }

      
    const notificationPromises = project.members.map(async (member) => {
      const memberId = member.user.toString();
      try {
        const notification = await this.notificationUseCase.execute(
          memberId,
          "Sprint Started",
          `Sprint "${
            sprintName || updatedSprint.sprintName
          }" has been started in project "${project.name}" with start date ${
            updatedSprint.startDate
          } and end date ${updatedSprint.endDate}.`,
          "Sprint activity update",
          "Sprint Notification",
          undefined,
          undefined,
          projectId,
          "SPRINT_STARTED",
          NotificationStatus.WARNING
        );
        console.log(
          `Created notification for member ${memberId}:`,
          notification
        );
        await this.notificationService.notifyUser(notification);
        console.log(`Sent notification to member ${memberId}`);
      } catch (error: any) {
        console.error(
          `Failed to send notification to member ${memberId}:`,
          error.message,
          error.stack
        );
      }
    });

    // Wait for all notifications to complete
    await Promise.all(notificationPromises);

    return updatedSprint;
  }
}
