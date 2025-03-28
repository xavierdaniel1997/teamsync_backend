import { IPlan } from "../../../domain/entities/plan";
import { IPlanRepository } from "../../../domain/repositories/planRepo";

export class GetPlanUseCase {
    constructor(
        private planRepo: IPlanRepository
    ) { }

    async execute(): Promise<IPlan[]> {
        return this.planRepo.findAll();
    }

    async getById(id: string): Promise<IPlan | null> {
        return this.planRepo.findById(id);
    }
}