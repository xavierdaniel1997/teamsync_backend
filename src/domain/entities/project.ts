import { Types } from "mongoose";

export enum ProjectAccessLevel {
    OWNER = "OWNER",
    READ = "READ",
    WRITE = "WRITE",
    NONE = "NONE",
}

export interface IProject {
    _id?: Types.ObjectId;
    projectkey: string;
    name: string;
    description?: string;
    workspace: Types.ObjectId;
    owner: Types.ObjectId;
    members: { user: Types.ObjectId; accessLevel: ProjectAccessLevel }[];
    backlog?: string[];
    sprints?: string[];
    taskCounter: number;
    createdAt: Date;
}