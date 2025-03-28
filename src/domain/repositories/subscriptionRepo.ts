import { ISubscription } from "../entities/subscription";

export interface ISubscriptionRepo{
    findByWorkspace(workspaceId: string): Promise<ISubscription | null>;
    createOrUpdate(subscription: ISubscription): Promise<ISubscription>;
    findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<ISubscription | null>;
}