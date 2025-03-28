import stripe from "../../config/stripe";
import { IStripeRepository } from "../../domain/repositories/stripeRepo";

export class StripeRepositoryImp implements IStripeRepository {
    async createPlan(name: string, price: number): Promise<{ productId: string; priceId: string; }> {
        const product = await stripe.products.create({
            name,
        });
        const priceObj = await stripe.prices.create({
            product: product.id,
            unit_amount: price * 100,
            currency: "usd",
            recurring: { interval: "month" },
        });

        return { productId: product.id, priceId: priceObj.id };
    }


    async updatePlan(productId: string, priceId: string, price: number): Promise<{ priceId: string }> {
        await stripe.prices.update(priceId, {
            active: false
        });
        const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: price * 100,
            currency: "usd",
            recurring: { interval: "month" },
        });
        console.log("newPrice", newPrice)

        return { priceId: newPrice.id };
    }

    async deletePlan(productId: string, priceId: string): Promise<void> {
        await stripe.prices.update(priceId, {
            active: false
        });
        await stripe.products.update(productId, {
            active: false
        });
    }


    async createCustomer(email: string, userId: string): Promise<string> {
        const customer = await stripe.customers.create({
          email,
          metadata: { userId }, 
        });
        return customer.id;
      }

    async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<string> {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        return session.id;
    }

}