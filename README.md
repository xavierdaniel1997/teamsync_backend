// infrastructure/controllers/webhookController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { HandleWebhookUseCase } from "../../application/usecase/webhook/handleWebhookUseCase";

export class WebhookController {
  constructor(
    private stripe: Stripe,
    private handleWebhookUseCase: HandleWebhookUseCase
  ) {}

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      res.status(400).send("Webhook Error: Invalid signature");
      return;
    }

    try {
      await this.handleWebhookUseCase.execute(event);
      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook processing failed:", err);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
}















// infrastructure/webhook/stripeWebhook.ts
import express from "express";
import Stripe from "stripe";
import { ISubscriptionRepo } from "../../domain/repositories/subscriptionRepo";
import { IPlanRepository } from "../../domain/repositories/planRepo";
import { HandleWebhookUseCase } from "../../application/usecase/webhook/handleWebhookUseCase";
import { WebhookController } from "../../infrastructure/controllers/webhookController";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const setupWebhook = (
  app: express.Application,
  subscriptionRepo: ISubscriptionRepo,
  planRepo: IPlanRepository
) => {
  const handleWebhookUseCase = new HandleWebhookUseCase({
    subscriptionRepo,
    planRepo,
    stripe,
  });
  const webhookController = new WebhookController(stripe, handleWebhookUseCase);

  app.post(
    "/webhook/stripe",
    express.raw({ type: "application/json" }),
    webhookController.handleWebhook.bind(webhookController) // Bind to preserve `this`
  );
};