import { IPlan } from "../entities/plan";

export interface IPlanRepository{
    findByName(name: string): Promise<IPlan | null>;
    create(plan: IPlan): Promise<IPlan>;
    findById(id: string): Promise<IPlan | null>;
    update(id: string, planData: Partial<IPlan>): Promise<IPlan>;
    findAll(): Promise<IPlan[]>; 
    delete(id: string): Promise<void>;
    findByStripePriceId(stripePriceId: string): Promise<IPlan | null>;
}