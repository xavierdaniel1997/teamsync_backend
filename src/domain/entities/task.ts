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

export interface IFile {
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
}

export interface ITask {
    id?: string;
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
    sprint?: Types.ObjectId | string;
    storyPoints?: number;
    files?: IFile[];
    createdAt: Date;
    updatedAt: Date;
}