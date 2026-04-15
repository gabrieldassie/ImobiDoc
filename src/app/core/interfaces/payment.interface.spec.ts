import { describe, it, expect } from 'vitest';
import type { IPaymentService, CheckoutSession, SubscriptionStatus, PricingTier } from './payment.interface';

describe('IPaymentService Interface Contract', () => {
  it('should define a valid CheckoutSession', () => {
    const session: CheckoutSession = {
      sessionId: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    };
    expect(session.sessionId).toBe('cs_test_123');
    expect(session.url).toContain('stripe.com');
  });

  it('should define a valid SubscriptionStatus for free tier', () => {
    const status: SubscriptionStatus = {
      tier: 'free',
      status: 'inactive',
    };
    expect(status.tier).toBe('free');
    expect(status.status).toBe('inactive');
  });

  it('should define a valid SubscriptionStatus for pro tier', () => {
    const status: SubscriptionStatus = {
      tier: 'pro',
      status: 'active',
      currentPeriodEnd: new Date('2026-12-31'),
    };
    expect(status.tier).toBe('pro');
    expect(status.currentPeriodEnd).toBeInstanceOf(Date);
  });

  it('should support all PricingTiers', () => {
    const tiers: PricingTier[] = ['free', 'pro'];
    expect(tiers).toHaveLength(2);
  });

  it('IPaymentService should have all required method signatures', () => {
    const mockService: IPaymentService = {
      createCheckoutSession: async () => ({ sessionId: 'cs_test', url: 'https://example.com' }),
      redirectToCheckout: async () => {},
      getSubscriptionStatus: async () => ({ tier: 'free', status: 'inactive' }),
      cancelSubscription: async () => {},
    };
    expect(typeof mockService.createCheckoutSession).toBe('function');
    expect(typeof mockService.redirectToCheckout).toBe('function');
    expect(typeof mockService.getSubscriptionStatus).toBe('function');
    expect(typeof mockService.cancelSubscription).toBe('function');
  });

  it('should throw when cancelling with empty subscription id', async () => {
    const mockService: IPaymentService = {
      createCheckoutSession: async () => ({ sessionId: '', url: '' }),
      redirectToCheckout: async () => {},
      getSubscriptionStatus: async () => ({ tier: 'free', status: 'inactive' }),
      cancelSubscription: async (id: string) => {
        if (!id) throw new Error('Subscription ID required');
      },
    };
    await expect(mockService.cancelSubscription('')).rejects.toThrow('Subscription ID required');
  });
});
