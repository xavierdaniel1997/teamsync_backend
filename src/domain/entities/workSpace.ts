import { Types } from 'mongoose';

export enum WorkSpacePlan {
   FREE = "free",
   BASIC = "basic",
   PREMIUM = 'premium'
}

export interface IWorkspace{
    _id?: string;
    name: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    projects: Types.ObjectId[];
    teams: Types.ObjectId[];
    plan: WorkSpacePlan;
    subscription: Types.ObjectId | null;
    createdAt: Date;
}