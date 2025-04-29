import { Types } from "mongoose";

export enum SprintStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
  }
  
  export interface ISprint {
    _id?: string;
    project: Types.ObjectId | string;
    workspace: Types.ObjectId | string;
    name: string;
    goal?: string;
    startDate?: Date;
    endDate?: Date;
    status: SprintStatus;
    tasks: string[];
    createdAt: Date;
    updatedAt: Date;
  }