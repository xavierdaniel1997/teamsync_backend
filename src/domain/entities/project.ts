import { Types } from "mongoose";
import { IInvitation } from "./invitation";

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
    title?: string;
    projectCoverImg?: string;
    workspace: Types.ObjectId;
    owner: Types.ObjectId;
    // color: string;
    color: { class: string, hex: string };
    members: { user: Types.ObjectId; accessLevel: ProjectAccessLevel, }[];
    invitations?: IInvitation[];
    backlog?: string[];
    sprints?: string[];
    taskCounter: number;
    createdAt: Date;
}