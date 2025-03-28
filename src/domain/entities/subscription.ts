import { Types } from "mongoose";

export enum PlanStatus{
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
}


export interface ISubscription {
    id?: string;
    user: Types.ObjectId;
    workspace: Types.ObjectId;
    plan: Types.ObjectId;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    status: PlanStatus;
    createdAt: Date;
    expiresAt?: Date;
}