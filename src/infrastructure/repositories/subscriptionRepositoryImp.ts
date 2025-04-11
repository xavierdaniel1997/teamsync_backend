import { ISubscription } from "../../domain/entities/subscription";
import { ISubscriptionRepo } from "../../domain/repositories/subscriptionRepo";
import SubscriptionModel from "../database/subscritptionModel";

export class SubscriptionRepositoryImp implements ISubscriptionRepo {
    async findByWorkspace(workspaceId: string): Promise<ISubscription | null> {
        return await SubscriptionModel.findOne({ workspace: workspaceId });
    }

    async createOrUpdate(subscription: ISubscription): Promise<ISubscription> {
        const existing = await this.findByWorkspace(subscription.workspace.toString());
        if (existing) {
            return await SubscriptionModel.findByIdAndUpdate(existing?._id, subscription, { new: true }) as ISubscription;
        }
        const newSubscription = new SubscriptionModel(subscription);
        return await newSubscription.save();
    }

    async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<ISubscription | null> {
        return await SubscriptionModel.findOne({ stripeSubscriptionId });
    }

    async findByUser(userId: string): Promise<ISubscription | null> {
        const result = await SubscriptionModel.findOne({ user: userId })
            .populate("plan")
        return result
    }
}