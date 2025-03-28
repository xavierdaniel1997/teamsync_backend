export interface IStripeRepository {
    createPlan(name: string, price: number): Promise<{ productId: string; priceId: string }>;
    updatePlan(productId: string, priceId: string, price: number): Promise<{ priceId: string }>;
    deletePlan(productId: string, priceId: string): Promise<void>;

    createCustomer(email: string, userId: string): Promise<string>;
    // createSubscription(customerId: string, priceId: string): Promise<string>;
    createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<string>;
}