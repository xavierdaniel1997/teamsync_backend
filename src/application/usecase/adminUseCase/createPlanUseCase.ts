import { IPlan } from "../../../domain/entities/plan";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IStripeRepository } from "../../../domain/repositories/stripeRepo";

interface CreatePlanDTO {
    name: string;
    price: number;
    projectLimit: number | "unlimited";
    memberLimit: number | "unlimited";
    isActive?: boolean;
}


export class CreatePlanUseCase {
    constructor(
        private planRepo: IPlanRepository,  
        private stripeRepo: IStripeRepository
    ) { }

    async execute(planData: CreatePlanDTO): Promise<IPlan> {
        const { name, price, projectLimit, memberLimit, isActive } = planData;
        const existingPlan = await this.planRepo.findByName(name)
        if (existingPlan) {
            throw new Error("Plan with this name already exists");
        }
        let stripeProductId: string | undefined;
        let stripePriceId: string | undefined;
        if (price > 0) {
            const { productId, priceId } = await this.stripeRepo.createPlan(
                name,
                price
            );
            stripeProductId = productId;
            stripePriceId = priceId;
        }
        const plan: IPlan = {
            name: name,
            stripeProductId,
            stripePriceId,
            price: price,
            projectLimit: projectLimit === "unlimited" ? Infinity : projectLimit,
            memberLimit: memberLimit === "unlimited" ? Infinity : memberLimit,
            isActive: isActive ?? true,
            createdAt: new Date()
        };
        return this.planRepo.create(plan);
    }
}
