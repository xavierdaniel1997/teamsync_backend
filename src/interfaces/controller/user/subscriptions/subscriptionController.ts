import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { SubscriptionRepositoryImp } from "../../../../infrastructure/repositories/subscriptionRepositoryImp";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { PlanRepositoryImp } from "../../../../infrastructure/repositories/planRepositoryImp";
import { StripeRepositoryImp } from "../../../../infrastructure/repositories/stripeRepositoryImp";
import { CreateSubscriptionUseCase } from "../../../../application/usecase/subscription/createSubscriptionUseCase";

const subscriptionRepository = new SubscriptionRepositoryImp()
const workSpaceRepository = new WorkSpaceRepositoryImp()
const planRepository = new PlanRepositoryImp()
const stripeRepository = new StripeRepositoryImp()

const createSubscriptionUseCase = new CreateSubscriptionUseCase(subscriptionRepository,
    workSpaceRepository,
    planRepository,
    stripeRepository
)


const createSubscription = async (req: Request, res: Response) => {
    const {planId, workspaceId, paymentMethodId, email} = req.body;
    try {
        const userId = (req as any).user?.userId;
        const result = await createSubscriptionUseCase.execute({userId, workspaceId, planId, email})
        if (result.subscription) {
            sendResponse(res, 200, { subscription: result.subscription }, "Free subscription created successfully");
          } else if (result.sessionId) {
            sendResponse(res, 200, { sessionId: result.sessionId }, "Checkout session created successfully");
          } else {
            throw new Error("Unexpected result from subscription creation");
          }
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Something went wrong")
    }
}

export { createSubscription }