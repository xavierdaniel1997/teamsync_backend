import { IPlan } from "../../domain/entities/plan";
import { IPlanRepository } from "../../domain/repositories/planRepo";
import PlanModel from "../database/planModel";

export class PlanRepositoryImp implements IPlanRepository {
    async findByName(name: string): Promise<IPlan | null> {
        return await PlanModel.findOne({ name })
    }

    async create(plan: IPlan): Promise<IPlan> {
        const newPlan = new PlanModel(plan)
        return await newPlan.save()
    }

    async findById(id: string): Promise<IPlan | null> {
        return await PlanModel.findById(id)
    }


    async update(id: string, planData: Partial<IPlan>): Promise<IPlan> {
        const updatedPlan = await PlanModel.findByIdAndUpdate(
            id,
            { ...planData, updatedAt: new Date() },
            { new: true, runValidators: true } 
        );
        if (!updatedPlan) {
            throw new Error('Plan not found');
        }
        return updatedPlan;
    }



    async findAll(): Promise<IPlan[]> {
        const plans = await PlanModel.find();
        return plans;
    }

    async delete(id: string): Promise<void> {
        const result = await PlanModel.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Plan not found");
        }
    }

    async findByStripePriceId(stripePriceId: string): Promise<IPlan | null> {
        return await PlanModel.findOne({ stripePriceId });
      }
}