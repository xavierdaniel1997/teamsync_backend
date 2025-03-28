import { IPlan } from "../../../domain/entities/plan";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IStripeRepository } from "../../../domain/repositories/stripeRepo";

export class DeletePlanUseCase {
    constructor(
        private planRepo: IPlanRepository,
        private stripeRepo: IStripeRepository
    ) { }

    async execute(id: string): Promise<void> {
        const existingPlan = await this.planRepo.findById(id);
        if (!existingPlan) {
            throw new Error("Plan not found");
        }
        if (!existingPlan.stripeProductId || !existingPlan.stripePriceId) {
            throw new Error("Stripe product ID or price ID is missing");
        }
        await this.stripeRepo.deletePlan(
            existingPlan.stripeProductId,
            existingPlan.stripePriceId
        );

        await this.planRepo.delete(id);
    }
}