import { ISprint } from "../../domain/entities/sprint";
import { ISprintRepository } from "../../domain/repositories/sprintRepo";
import SprintModel from "../database/sprintModel";

export class SprintRepositoryImp implements ISprintRepository {
  async countByProject(projectId: string): Promise<number> {
    return SprintModel.countDocuments({ project: projectId }).exec();
  }

  async create(sprint: ISprint): Promise<ISprint> {
    const newSprint = await SprintModel.create(sprint);
    return newSprint.toObject();
  }

  async findById(id: string): Promise<ISprint | null> {
    const sprint = await SprintModel.findById(id).exec();
    return sprint ? sprint.toObject() : null;
  }

  async update(id: string, updates: Partial<ISprint>): Promise<ISprint | null> {
    const sprint = await SprintModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    return sprint ? sprint.toObject() : null;
  }

  async findByProject(projectId: string): Promise<ISprint[]> {
    const sprints = await SprintModel.find({ project: projectId }).exec();
    return sprints.map((sprint) => sprint.toObject());
  }
}