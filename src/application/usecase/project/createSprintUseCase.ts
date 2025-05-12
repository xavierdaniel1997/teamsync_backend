import { CreateSprintDTO } from "../../../domain/dtos/createSprintDTO";
import { ProjectAccessLevel } from "../../../domain/entities/project";
import { ISprint, SprintStatus } from "../../../domain/entities/sprint";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";

export class CreateSprintUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projctRepo: IProjectRepo,
    ) { }

    async execute(dto: CreateSprintDTO): Promise<void> {

        const project = await this.projctRepo.findById(dto.projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        if (project.workspace._id.toString() !== dto.workspaceId) {
            throw new Error("Workspace does not match project");
        }

        console.log("project details form the sprint create use case", project)
        const isOwner = project.owner._id.toString() === dto.userId;
        const member = project.members.find((member) => member.user.toString() === dto.userId)

        const hasWriteAccess = isOwner || (member && member.accessLevel === ProjectAccessLevel.WRITE)

        if (!hasWriteAccess) {
            throw new Error("User does not have permission to create tasks");
        }

        const sprintCount = await this.sprintRepo.countByProject(dto.projectId);
        const sprintName = dto.sprintName ? dto.sprintName : `Sprint ${sprintCount + 1}`;

        const sprint: ISprint = {
            project: dto.projectId,
            workspace: dto.workspaceId,
            sprintName: sprintName,
            goal: dto.goal,
            startDate: dto.startDate,
            endDate: dto.endDate,
            status: SprintStatus.PLANNED,
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
      
          const newSprint = await this.sprintRepo.create(sprint);

    }
}