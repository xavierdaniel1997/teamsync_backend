import { IPlan } from "../../../domain/entities/plan";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IStripeRepository } from "../../../domain/repositories/stripeRepo";


export class UpdatePlanUseCase {
    constructor(
        private planRepo: IPlanRepository,
        private stripeRepo: IStripeRepository
    ) { }

    async execute(id: string, planData: Partial<IPlan>): Promise<IPlan> {
        const existingPlan = await this.planRepo.findById(id);
        if (!existingPlan) {
            throw new Error("Plan not found");
        }

        let newStripePriceId = existingPlan.stripePriceId;
        if (planData.price !== undefined) {
            if (!existingPlan.stripeProductId || !existingPlan.stripePriceId) {
                throw new Error("Stripe product ID or price ID is missing");
            }

            const stripeUpdate = await this.stripeRepo.updatePlan(
                existingPlan.stripeProductId,
                existingPlan.stripePriceId,
                Number(planData.price)
            );
            newStripePriceId = stripeUpdate.priceId;
        }

        const updatedPlanData: Partial<IPlan> = {
            ...planData,
            stripePriceId: newStripePriceId,
            updatedAt: new Date(),
            name: planData.name !== undefined ? planData.name : existingPlan.name,
            price: planData.price !== undefined ? planData.price : existingPlan.price,
        };

        const updatedPlan = await this.planRepo.update(id, updatedPlanData);
        return updatedPlan;
    }
}