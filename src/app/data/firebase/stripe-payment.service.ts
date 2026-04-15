import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import type { IPaymentService, CheckoutSession, SubscriptionStatus } from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripePaymentService implements IPaymentService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(environment.stripe.publishableKey);
  }

  async createCheckoutSession(priceId: string, userId: string): Promise<CheckoutSession> {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId }),
    });
    if (!response.ok) throw new Error('Failed to create checkout session');
    return response.json() as Promise<CheckoutSession>;
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const response = await fetch(`/api/checkout-session/${encodeURIComponent(sessionId)}`);
    if (!response.ok) throw new Error('Failed to retrieve checkout session');
    const session = await response.json() as { url?: string };
    if (session?.url) {
      window.location.href = session.url;
    } else {
      throw new Error('No checkout URL available');
    }
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const response = await fetch(`/api/subscription-status?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) return { tier: 'free', status: 'inactive' };
    return response.json() as Promise<SubscriptionStatus>;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId }),
    });
    if (!response.ok) throw new Error('Failed to cancel subscription');
  }
}
