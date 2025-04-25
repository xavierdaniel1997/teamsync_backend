import { IFile, TaskPriority, TaskStatus, TaskType } from "../entities/task";

export interface CreateTaskDTO {
  project: string;
  workspace: string;
  // key: string;
  title: string;
  description?: string;
  type: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  reporterId: string;
  epic?: string;
  parent?: string;
  sprint?: string;
  storyPoints?: number;
  files?: IFile[];
}