import { Types } from "mongoose";

export enum TaskType {
    EPIC = "EPIC",
    STORY = "STORY",
    SUBTASK = "SUBTASK",
    BUG = "BUG",
  }
  
  export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
  }
  
  export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
  }
  
  export interface ITask {
    id?: string;
    project: Types.ObjectId;
    workspace: Types.ObjectId;
    key: string;
    title: string;
    description?: string;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    assignee?: string;
    reporter: string;
    epic?: string;
    parent?: string;
    sprint?: string;
    storyPoints?: number;
    createdAt: Date;
    updatedAt: Date;
  }