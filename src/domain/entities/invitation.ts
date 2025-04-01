import { Types } from "mongoose";
import { ProjectAccessLevel } from "./project";

export enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED"
}

export interface IInvitation {
    _id?: Types.ObjectId;
    email: string;
    inviter: Types.ObjectId;
    project: Types.ObjectId;
    workspace: Types.ObjectId;
    accessLevel: ProjectAccessLevel;
    status: InvitationStatus;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}