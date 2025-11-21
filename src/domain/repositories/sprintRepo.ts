import { UpdateQuery } from "mongoose";
import { ISprint } from "../entities/sprint";
import { ITask } from "../entities/task";

export interface ISprintRepository {
  countByProject(projectId: string): Promise<number>;
  create(sprint: ISprint): Promise<ISprint>;
  findById(id: string): Promise<ISprint | null>;
  update(id: string, updates: UpdateQuery<ISprint>): Promise<ISprint | null>;
  findByProject(projectId: string): Promise<ISprint[]>;
  addTask(sprintId: string, taskId: string): Promise<ISprint | null>;
  findFilterTaskInsprint(sprintId: string, assignees?: string[], epics?: string[]): Promise<ITask[]>;
  // findFilterTaskInsprint(sprintId: string, assignees?: string[], epics?: string[]): Promise<{ sprint: ISprint, tasks: ITask[] }>;
  findTasksInSprint(sprintId: string): Promise<ITask[]>;
  delete(id: string): Promise<void>;
}