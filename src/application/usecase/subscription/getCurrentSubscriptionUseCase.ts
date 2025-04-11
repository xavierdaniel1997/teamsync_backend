import { ISubscription, PlanStatus } from "../../../domain/entities/subscription";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";


export class GetCurrentSubscriptionUseCase {
    constructor(
        private subscriptionRepo: ISubscriptionRepo
    ) { }

    async execute(userId: string): Promise<ISubscription | null> {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const subscription = await this.subscriptionRepo.findByUser(userId);

        if (!subscription) {
            return null;
        }
        if (subscription.status !== PlanStatus.ACTIVE) {
            return null;
        }
        return subscription;
    }
} 