import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { serverTimestamp } from '@angular/fire/firestore';
import { FirebaseAuthService, FirebaseDataService } from '../../../data/firebase';
import type { Property, PropertyType } from '../../../data/models';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <a routerLink="/properties" class="back-link">← Voltar</a>
        <h1>{{ isEditing() ? 'Editar Imóvel' : 'Novo Imóvel' }}</h1>
      </div>
      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="field-grid">
            <div class="field span-2">
              <label>Nome do Imóvel</label>
              <input type="text" formControlName="name" placeholder="Ex: Apartamento Centro" />
            </div>
            <div class="field">
              <label>Tipo</label>
              <select formControlName="type">
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="commercial">Comercial</option>
                <option value="land">Terreno</option>
              </select>
            </div>
            <div class="field">
              <label>Área (m²)</label>
              <input type="number" formControlName="area" placeholder="100" />
            </div>
            <div class="field span-2">
              <label>Endereço</label>
              <input type="text" formControlName="address" placeholder="Rua, número, bairro" />
            </div>
            <div class="field">
              <label>Cidade</label>
              <input type="text" formControlName="city" />
            </div>
            <div class="field">
              <label>Estado</label>
              <input type="text" formControlName="state" maxlength="2" placeholder="SP" />
            </div>
            <div class="field span-2">
              <label>Notas</label>
              <textarea formControlName="notes" rows="3" placeholder="Informações adicionais..."></textarea>
            </div>
          </div>
          @if (errorMessage()) { <p class="error">{{ errorMessage() }}</p> }
          <div class="form-actions">
            <a routerLink="/properties" class="btn-cancel">Cancelar</a>
            <button type="submit" [disabled]="form.invalid || isSaving()" class="btn-save">
              {{ isSaving() ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .back-link { font-size: .875rem; color: #10B981; text-decoration: none; display: block; margin-bottom: .5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #1E293B; margin: 0; }
    .form-card { background: white; border-radius: .75rem; border: 1px solid #E2E8F0; padding: 1.5rem; }
    .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: .375rem; }
    .span-2 { grid-column: span 2; }
    label { font-size: .875rem; font-weight: 500; color: #374151; }
    input, select, textarea { padding: .5rem .75rem; border: 1px solid #D1D5DB; border-radius: .5rem; font-size: .875rem; font-family: inherit; }
    input:focus, select:focus, textarea:focus { outline: 2px solid #10B981; border-color: transparent; }
    .error { color: #EF4444; font-size: .875rem; margin-top: .5rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: .75rem; margin-top: 1.5rem; }
    .btn-cancel { padding: .5rem 1rem; border: 1px solid #D1D5DB; border-radius: .5rem; font-size: .875rem; text-decoration: none; color: #374151; }
    .btn-save { padding: .5rem 1.25rem; background: #10B981; color: white; border: none; border-radius: .5rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-save:disabled { opacity: .5; cursor: not-allowed; }
    @media(max-width:600px) { .field-grid { grid-template-columns: 1fr; } .span-2 { grid-column: 1; } }
  `],
})
export class PropertyDetailComponent implements OnInit {
  private readonly auth = inject(FirebaseAuthService);
  private readonly data = inject(FirebaseDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isEditing = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  private userId = '';
  private propertyId = '';

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['apartment' as PropertyType, Validators.required],
    area: [null as number | null],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      if (!user) return;
      this.userId = user.uid;
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.propertyId = id;
        this.isEditing.set(true);
        this.data.getDocument<Property>(`users/${user.uid}/properties/${id}`).subscribe((p) => {
          if (p) this.form.patchValue(p as Parameters<typeof this.form.patchValue>[0]);
        });
      }
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    try {
      const now = serverTimestamp();
      const data = { ...this.form.value, ownerId: this.userId, updatedAt: now };
      if (this.isEditing()) {
        await this.data.updateDocument(`users/${this.userId}/properties/${this.propertyId}`, data);
      } else {
        await this.data.addDocument(`users/${this.userId}/properties`, { ...data, createdAt: now });
      }
      await this.router.navigate(['/properties']);
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
