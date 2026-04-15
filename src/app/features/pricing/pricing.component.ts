import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../data/firebase';
import { StripePaymentService } from '../../data/firebase';
import { environment } from '../../../environments/environment';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  tier: 'free' | 'pro';
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pricing-page">
      <div class="pricing-header">
        <h1>Escolha seu Plano</h1>
        <p>Comece gratuitamente. Faça upgrade quando precisar de mais.</p>
      </div>

      <div class="plans-grid">
        @for (plan of plans; track plan.tier) {
          <div class="plan-card" [class.highlighted]="plan.highlighted">
            @if (plan.highlighted) {
              <div class="popular-badge">Mais Popular</div>
            }
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">{{ plan.price }}<span class="plan-period">/mês</span></div>
            <p class="plan-desc">{{ plan.description }}</p>
            <ul class="features-list">
              @for (f of plan.features; track f) {
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  {{ f }}
                </li>
              }
            </ul>
            @if (currentTier() === plan.tier) {
              <button disabled class="btn-current">Plano Atual</button>
            } @else if (plan.tier === 'pro') {
              <button (click)="upgrade()" [disabled]="isLoading()" class="btn-upgrade">
                {{ isLoading() ? 'Aguarde...' : plan.cta }}
              </button>
            } @else {
              <a routerLink="/auth/register" class="btn-free">{{ plan.cta }}</a>
            }
          </div>
        }
      </div>

      @if (errorMessage()) {
        <p class="error">{{ errorMessage() }}</p>
      }

      <p class="guarantee">✓ Cancele a qualquer momento &nbsp;·&nbsp; ✓ Sem taxas ocultas &nbsp;·&nbsp; ✓ Suporte por e-mail</p>
    </div>
  `,
  styles: [`
    .pricing-page { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; text-align: center; }
    .pricing-header h1 { font-size: 2rem; font-weight: 700; color: #1E293B; margin-bottom: .5rem; }
    .pricing-header p { color: #6B7280; margin-bottom: 2.5rem; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
    .plan-card { background: white; border-radius: 1rem; border: 2px solid #E2E8F0; padding: 2rem 1.5rem; position: relative; text-align: left; }
    .plan-card.highlighted { border-color: #10B981; box-shadow: 0 8px 24px rgba(16,185,129,.15); }
    .popular-badge { position: absolute; top: -1px; right: 1.5rem; background: #10B981; color: white; font-size: .75rem; font-weight: 700; padding: .25rem .75rem; border-radius: 0 0 .5rem .5rem; }
    .plan-name { font-size: 1.125rem; font-weight: 700; color: #1E293B; margin-bottom: .5rem; }
    .plan-price { font-size: 2.5rem; font-weight: 800; color: #1E293B; }
    .plan-period { font-size: 1rem; font-weight: 400; color: #9CA3AF; }
    .plan-desc { color: #6B7280; font-size: .875rem; margin: .75rem 0 1.5rem; }
    .features-list { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: .625rem; }
    .features-list li { display: flex; align-items: center; gap: .625rem; font-size: .875rem; color: #374151; }
    .features-list svg { width: 1.125rem; height: 1.125rem; flex-shrink: 0; color: #10B981; stroke: #10B981; }
    .btn-upgrade, .btn-free, .btn-current { display: block; width: 100%; padding: .75rem 1rem; border-radius: .625rem; font-size: .9375rem; font-weight: 700; text-align: center; text-decoration: none; cursor: pointer; border: none; }
    .btn-upgrade { background: #10B981; color: white; }
    .btn-upgrade:hover { background: #059669; }
    .btn-upgrade:disabled { opacity: .5; cursor: not-allowed; }
    .btn-free { border: 2px solid #E2E8F0; color: #374151; background: transparent; }
    .btn-free:hover { background: #F9FAFB; }
    .btn-current { background: #F1F5F9; color: #9CA3AF; cursor: default; }
    .error { color: #EF4444; font-size: .875rem; }
    .guarantee { color: #9CA3AF; font-size: .8125rem; margin-top: 1rem; }
  `],
})
export class PricingComponent {
  private readonly auth = inject(FirebaseAuthService);
  private readonly payment = inject(StripePaymentService);

  isLoading = signal(false);
  errorMessage = signal('');
  currentTier = signal<'free' | 'pro'>('free');

  plans: PricingPlan[] = [
    {
      name: 'Free', price: 'R$ 0', description: 'Para proprietários que estão começando.',
      features: ['Até 2 imóveis', 'Até 10 manutenções/mês', 'Histórico básico', 'Suporte por e-mail'],
      cta: 'Começar Grátis', highlighted: false, tier: 'free',
    },
    {
      name: 'Pro', price: 'R$ 29,90', description: 'Para gestão profissional de múltiplos imóveis.',
      features: ['Imóveis ilimitados', 'Manutenções ilimitadas', 'Relatórios e exportação PDF', 'Notificações e lembretes', 'Upload de documentos', 'Suporte prioritário'],
      cta: 'Assinar PRO', highlighted: true, tier: 'pro',
    },
  ];

  constructor() {
    this.auth.currentUser$.subscribe((user) => {
      if (user) this.currentTier.set(user.tier);
    });
  }

  async upgrade(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const user = await new Promise<{ uid: string } | null>((resolve) =>
        this.auth.currentUser$.subscribe({ next: (u) => resolve(u) })
      );
      if (!user) throw new Error('Usuário não autenticado.');
      const session = await this.payment.createCheckoutSession(
        environment.stripe.proPriceId,
        user.uid
      );
      await this.payment.redirectToCheckout(session.sessionId);
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erro ao processar pagamento.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
