import { Request, Response } from "express";
import Stripe from "stripe";
import { HandleWebhookUseCase } from "../../../../application/usecase/subscription/handleWebhookUseCase";
import { SubscriptionRepositoryImp } from "../../../../infrastructure/repositories/subscriptionRepositoryImp";
import { PlanRepositoryImp } from "../../../../infrastructure/repositories/planRepositoryImp";
import stripe from "../../../../config/stripe";

const subscriptionRepo = new SubscriptionRepositoryImp()
const planRepository = new PlanRepositoryImp()

const handleWebhookUseCase = new HandleWebhookUseCase(subscriptionRepo, planRepository, stripe)

const handleWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
    console.log("🔹 Webhook request received at /api/webhook");
  console.log("Headers:", req.headers);
  console.log("Raw body:", req.body);
  const sig = req.headers["stripe-signature"] as string;
  console.log("sig", sig)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log("Webhook Secret:", webhookSecret);


  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
    console.log("Received Stripe Webhook Event:", event);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send("Webhook Error: Invalid signature");
    return;
  }

  try {
    await handleWebhookUseCase.execute(event);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};


export {handleWebhook}