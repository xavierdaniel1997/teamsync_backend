import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { PlanRepositoryImp } from "../../../infrastructure/repositories/planRepositoryImp";
import { CreatePlanUseCase } from "../../../application/usecase/adminUseCase/createPlanUseCase";
import { StripeRepositoryImp } from "../../../infrastructure/repositories/stripeRepositoryImp";
import { UpdatePlanUseCase } from "../../../application/usecase/adminUseCase/updatePlanUseCase";
import { GetPlanUseCase } from "../../../application/usecase/adminUseCase/getPlanUseCase";
import { DeletePlanUseCase } from "../../../application/usecase/adminUseCase/deletePlanUseCase";

const planRepo = new PlanRepositoryImp()
const stripeRepo = new StripeRepositoryImp()
const createPlanUseCase = new CreatePlanUseCase(planRepo, stripeRepo)
const updatePlanUseCase = new UpdatePlanUseCase(planRepo, stripeRepo)
const getPlanUseCase = new GetPlanUseCase(planRepo)
const deletePlanUseCase = new DeletePlanUseCase(planRepo, stripeRepo);

const createPlanController = async (req: Request, res: Response): Promise<void> => {
    try{
        const {name, price, projectLimit, memberLimit, isActive} = req.body
        const plan = await createPlanUseCase.execute({name, price, projectLimit, memberLimit, isActive})
        console.log("new plan created", plan)
        sendResponse(res, 200, plan, "Plan created successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

const updatePlanController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const { name, price, projectLimit, memberLimit, isActive } = req.body;
        const updatedPlan = await updatePlanUseCase.execute(id, {
            name,
            price,
            projectLimit,
            memberLimit,            
            isActive
        });
        sendResponse(res, 200, updatedPlan, "Plan updated successfully");
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

const getPlansController = async (req: Request, res: Response): Promise<void> => {
    try {
        const plans = await getPlanUseCase.execute();     
        sendResponse(res, 200, plans, "Plans retrieved successfully");
    } catch(error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong");
    }
};


const deletePlanController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await deletePlanUseCase.execute(id);
        sendResponse(res, 200, null, "Plan deleted successfully");
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong");
    }
}

export {createPlanController, updatePlanController, getPlansController, deletePlanController}