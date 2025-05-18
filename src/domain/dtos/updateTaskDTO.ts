import { TaskPriority, TaskStatus, TaskType } from "../entities/task";

export interface UpdateTaskDTO {
  workspace: string;
  project: string;
  taskId: string;
  title?: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;    
  epicId?: string;
  parent?: string;
  sprint?: string;
  storyPoints?: number;
  files?: Array<{
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
    size: number;
  }>;
}