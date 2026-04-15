export type PricingTier = 'free' | 'pro';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface SubscriptionStatus {
  tier: PricingTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
  currentPeriodEnd?: Date;
}

export interface IPaymentService {
  createCheckoutSession(priceId: string, userId: string): Promise<CheckoutSession>;
  redirectToCheckout(sessionId: string): Promise<void>;
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}
