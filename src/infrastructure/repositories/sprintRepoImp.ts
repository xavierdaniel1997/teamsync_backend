import mongoose, { UpdateQuery } from "mongoose";
import { ISprint } from "../../domain/entities/sprint";
import { ITask, TaskType } from "../../domain/entities/task";
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



  async update(id: string, updates: UpdateQuery<ISprint>): Promise<ISprint | null> {
    const sprint = await SprintModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    return sprint ? sprint.toObject() : null;
  }


  async findByProject(projectId: string): Promise<ISprint[]> {
    const sprints = await SprintModel.find({ project: projectId }).exec();
    return sprints.map((sprint) => sprint.toObject());
  }

  


  async addTask(sprintId: string, taskId: string): Promise<ISprint | null> {
    const sprint = await SprintModel.findByIdAndUpdate(
      sprintId,
      { $addToSet: { tasks: taskId } },
      { new: true }
    ).exec();
    return sprint ? sprint.toObject() : null;
  }


  async findTasksInSprint(sprintId: string, assignees?: string[], epics?: string[]): Promise<ITask[]> {
    const sprint = await SprintModel.findById(sprintId)
      .populate({
        path: "tasks",
        populate: [
          { path: "epic", select: "title taskKey" },
          { path: "assignee", select: "-password" },
          { path: "reporter", select: "-password" },
        ],
      })
      .exec();

    if (!sprint) {
      throw new Error("Sprint not found");
    }
    return sprint.tasks as unknown as ITask[];
  }

  async findFilterTaskInsprint(sprintId: string, assignees?: string[], epics?: string[]): Promise<ITask[]> {
    const sprint = await SprintModel.findById(sprintId)
    .populate({
      path: "tasks", 
      match: {
        ...(assignees && assignees.length > 0 ? { assignee: { $in: assignees } } : {}),
        ...(epics && epics.length > 0 ? { epic: { $in: epics } } : {}),
      },
      populate: [
        { path: "epic", select: "title taskKey" },
        { path: "assignee", select: "-password" },
        { path: "reporter", select: "-password" },
        {path: "sprint"}
      ],              
    })
    .exec();

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    return sprint.tasks as unknown as ITask[];
  }





  async delete(id: string): Promise<void> {
    await SprintModel.findByIdAndDelete(id).exec();
  }

}