import { ISprint } from "../../../domain/entities/sprint";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISprintRepository } from "../../../domain/repositories/sprintRepo";

export class GetSprintUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private projectRepo: IProjectRepo
    ) { }

    async execute(userId: string, projectId: string): Promise<ISprint[]> {
        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        const sprints = await this.sprintRepo.findByProject(projectId)
        
        return sprints;
    }
}