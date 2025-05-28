import { Types } from "mongoose";

export enum TaskType {
    EPIC = "EPIC",
    STORY = "STORY",
    TASK = "TASK",
    SUBTASK = "SUBTASK",
    BUG = "BUG",
}

export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",    
    DONE = "DONE",
    // BLOCKED = "BLOCKED",           
    // TESTING = "TESTING",  
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export interface IFile {
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
}

export interface ITask {
    _id?: string;
    project: Types.ObjectId | string;
    workspace: Types.ObjectId | string;
    taskKey: string;
    title: string;
    description?: string;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    assignee?: Types.ObjectId | string;
    reporter?: Types.ObjectId | string;
    epic?: Types.ObjectId | string;
    parent?: Types.ObjectId | string;
    sprint?: Types.ObjectId | string | null ;
    storyPoints?: number;
    files?: IFile[];
    createdAt: Date;
    updatedAt: Date;
}

export interface KanbanStatusGroup {
  status: TaskStatus;
  tasks: ITask[];
}

export interface KanbanResponse {
  success: boolean;
  status: number;
  message: string;
  data: KanbanStatusGroup[];
}