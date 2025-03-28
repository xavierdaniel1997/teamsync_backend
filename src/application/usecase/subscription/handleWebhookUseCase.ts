import Stripe from "stripe";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";
import stripe from "../../../config/stripe";
import { Types } from "mongoose";
import { ISubscription, PlanStatus } from "../../../domain/entities/subscription";

export class HandleWebhookUseCase {
    constructor(
        private subscriptionRepo: ISubscriptionRepo,
        private planRepo: IPlanRepository,
        private stripe: Stripe
    ) { }

    async execute(event: Stripe.Event): Promise<void> {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                if (!subscriptionId || !customerId) {
                    console.error("Missing subscription or customer ID.");
                    return;
                }

                const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = stripeSubscription.items.data[0].price.id;


                const plan = await this.planRepo.findByStripePriceId(priceId)
                if (!plan) {
                    console.error("Plan not found for price ID:", priceId)
                }

                console.log("still working the webhook", stripeSubscription)
                const successUrl = new URL(session.success_url!);
                const userId = successUrl.searchParams.get("userId")!;
                const workspaceId = successUrl.searchParams.get("workspaceId")!;
                const planId = successUrl.searchParams.get("planId")!;

                const subscriptionDetails: ISubscription = {
                    user: new Types.ObjectId(userId),
                    workspace: new Types.ObjectId(workspaceId),
                    plan: new Types.ObjectId(planId),
                    stripeSubscriptionId: subscriptionId,
                    stripeCustomerId: customerId,
                    status: PlanStatus.ACTIVE,
                    createdAt: new Date(),
                    expiresAt: new Date(stripeSubscription.current_period_end * 1000),
                };

                const subscription = await this.subscriptionRepo.createOrUpdate(subscriptionDetails);
                console.log("Paid subscription created via webhook:", subscription);
                break;

            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
}














/*


case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const existingSubscription = await subscriptionRepo.findByStripeSubscriptionId(subscription.id);
        if (existingSubscription) {
          existingSubscription.status = subscription.status === "active" ? PlanStatus.ACTIVE : PlanStatus.PAST_DUE;
          existingSubscription.expiresAt = new Date(subscription.current_period_end * 1000);
          await subscriptionRepo.createOrUpdate(existingSubscription);
          console.log("Subscription updated:", subscription.id);
        }
        break;
      }

case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const existingSubscription = await subscriptionRepo.findByStripeSubscriptionId(subscription.id);
        if (existingSubscription) {
          existingSubscription.status = PlanStatus.CANCELED;
          existingSubscription.expiresAt = new Date();
          await subscriptionRepo.createOrUpdate(existingSubscription);
          console.log("Subscription canceled:", subscription.id);
        }
        break;
      }

*/