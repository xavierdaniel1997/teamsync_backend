import { Types } from "mongoose";
import { ISubscription, PlanStatus } from "../../../domain/entities/subscription";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IStripeRepository } from "../../../domain/repositories/stripeRepo";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

interface CreateSubscriptionDTO {
    userId: string,
    workspaceId: string,
    planId: string,
    email: string,
}

export class CreateSubscriptionUseCase {
    constructor(
        private subscriptionRepo: ISubscriptionRepo,
        private workSpaceRepo: IWorkSpaceRepo,
        private planRepo: IPlanRepository,
        private stripeRepo: IStripeRepository,
    ) { }

    async execute(subscriptionData: CreateSubscriptionDTO): Promise<{ subscription?: ISubscription; sessionId?: string }> {
        const { userId, workspaceId, planId, email } = subscriptionData;
        const workspace = await this.workSpaceRepo.findWorkSpaceByOwner(userId)
        // console.log("workspace detials", workspace)
        if (!workspace || workspace._id?.toString() !== workspaceId) {
            throw new Error("Workspace not found or not owned by user")
        }

        const plan = await this.planRepo.findById(planId)
        if (!plan) throw new Error("Invalid plan selected")
        // console.log("this is the plan detilas", plan)

        if (plan.price === 0) {
            const subscriptionDetials: ISubscription = {
                user: new Types.ObjectId(userId),
                workspace: new Types.ObjectId(workspaceId),
                plan: new Types.ObjectId(planId),
                status: PlanStatus.ACTIVE,
                createdAt: new Date(),
            };
            const subscription = await this.subscriptionRepo.createOrUpdate(subscriptionDetials)
            console.log("subscription free plan crated", subscription)
            return { subscription };
        } else {
            if (!plan.stripePriceId) throw new Error("Stripe Price ID not configured for this plan");

            const customerId = await this.stripeRepo.createCustomer(email, userId);


            const successUrl = `http://localhost:5173/success?workspaceId=${workspaceId}&planId=${planId}&userId=${userId}`;
            const cancelUrl = `http://localhost:5173/cancel`;
            const sessionId = await this.stripeRepo.createCheckoutSession(customerId, plan.stripePriceId, successUrl, cancelUrl);
          

            return { sessionId };

        }

    }
}
