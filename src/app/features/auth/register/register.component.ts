import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../data/firebase';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">
            <svg fill="none" stroke="#10B981" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1>ImobiDoc</h1>
          <p>Crie sua conta gratuita</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">{{ errorMessage() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label>Nome Completo</label>
            <input type="text" formControlName="displayName" placeholder="Seu nome" />
          </div>
          <div class="field">
            <label>E-mail</label>
            <input type="email" formControlName="email" placeholder="seu@email.com" />
          </div>
          <div class="field">
            <label>Senha</label>
            <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres" />
          </div>
          <button type="submit" [disabled]="form.invalid || isLoading()" class="btn-full">
            {{ isLoading() ? 'Criando...' : 'Criar Conta Grátis' }}
          </button>
        </form>

        <p class="auth-link">
          Já tem conta? <a routerLink="/auth/login">Entrar</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background: #F8FAFC; }
    .auth-card { width: 100%; max-width: 400px; background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .auth-logo { text-align: center; margin-bottom: 1.5rem; }
    .logo-icon { display: inline-flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; background: #1E293B; border-radius: 1rem; margin-bottom: .75rem; }
    .logo-icon svg { width: 2rem; height: 2rem; }
    .auth-logo h1 { font-size: 1.5rem; font-weight: 700; color: #1E293B; margin: 0; }
    .auth-logo p { color: #6B7280; font-size: .875rem; margin: .25rem 0 0; }
    .error-banner { background: #FEF2F2; border: 1px solid #FCA5A5; color: #B91C1C; padding: .75rem 1rem; border-radius: .5rem; font-size: .875rem; margin-bottom: 1rem; }
    .field { margin-bottom: 1rem; }
    .field label { display: block; font-size: .875rem; font-weight: 500; color: #374151; margin-bottom: .375rem; }
    .field input { width: 100%; padding: .5rem .75rem; border: 1px solid #D1D5DB; border-radius: .5rem; font-size: .875rem; box-sizing: border-box; }
    .field input:focus { outline: 2px solid #10B981; border-color: transparent; }
    .btn-full { width: 100%; padding: .625rem 1rem; background: #10B981; color: white; border: none; border-radius: .5rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-full:hover { background: #059669; }
    .btn-full:disabled { opacity: .5; cursor: not-allowed; }
    .auth-link { text-align: center; font-size: .875rem; color: #6B7280; margin-top: 1rem; }
    .auth-link a { color: #10B981; font-weight: 600; text-decoration: none; }
  `],
})
export class RegisterComponent {
  private readonly auth = inject(FirebaseAuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const { email, password, displayName } = this.form.value;
      await this.auth.signUpWithEmail(email!, password!, displayName!);
      await this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
