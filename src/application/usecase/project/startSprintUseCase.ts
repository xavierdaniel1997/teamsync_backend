import { UpdateSprintDTO } from "../../../domain/dtos/createSprintDTO";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ISprint, SprintStatus } from "../../../domain/entities/sprint";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class StartSprintUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projectRepo: IProjectRepo,
        private taskRepo: ITaskRepository,
        private workspaceRepo: IWorkSpaceRepo,
    ) { }

    async execute(dto: UpdateSprintDTO, userId: string): Promise<ISprint> {
        const { workspaceId, projectId, sprintId, sprintName, duration, sprintGoal, startDate, endDate } = dto;
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

        const sprint = await this.sprintRepo.findById(sprintId);
        console.log("sprint details form the deletesprint usecase", sprint)
        if (!sprint) {
            throw new Error("Sprint not found");
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
            effectiveEndDate.setDate(effectiveStartDate.getDate() + durationInWeeks * 7);
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

        return updatedSprint;
    }
}