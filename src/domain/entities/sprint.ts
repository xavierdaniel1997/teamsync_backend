import { Types } from "mongoose";

export enum SprintStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
  }
  
  export interface ISprint {
    _id?: string;
    sprintName?: string;
    project: Types.ObjectId | string;
    workspace: Types.ObjectId | string;
    goal?: string;
    duration?: string;
    startDate?: Date;
    endDate?: Date;
    status: SprintStatus;
    tasks: Types.ObjectId[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }