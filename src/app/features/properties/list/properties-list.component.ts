import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../../data/firebase';
import { FirebaseDataService } from '../../../data/firebase';
import type { Property } from '../../../data/models';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <h1>Meus Imóveis</h1>
        <a routerLink="/properties/new" class="btn-add">+ Novo Imóvel</a>
      </div>
      @if (isLoading()) {
        <p class="loading-text">Carregando...</p>
      } @else if (properties().length === 0) {
        <div class="empty">
          <div class="empty-icon">🏠</div>
          <h2>Nenhum imóvel cadastrado</h2>
          <p>Adicione seu primeiro imóvel para começar a gerenciar manutenções.</p>
          <a routerLink="/properties/new" class="btn-add">Adicionar Imóvel</a>
        </div>
      } @else {
        <div class="grid">
          @for (p of properties(); track p.id) {
            <a [routerLink]="['/properties', p.id]" class="property-card">
              <div class="thumb">
                @if (p.imageURL) { <img [src]="p.imageURL" [alt]="p.name"/> }
                @else { <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> }
              </div>
              <div class="info">
                <p class="name">{{ p.name }}</p>
                <p class="address">{{ p.address }}, {{ p.city }} - {{ p.state }}</p>
                <span class="type-badge">{{ p.type }}</span>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 1.5rem; max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #1E293B; margin: 0; }
    .btn-add { padding: .5rem 1rem; background: #10B981; color: white; border-radius: .5rem; font-weight: 600; font-size: .875rem; text-decoration: none; }
    .loading-text, .empty p { color: #6B7280; }
    .empty { text-align: center; padding: 4rem 1rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty h2 { font-size: 1.25rem; color: #1E293B; margin-bottom: .5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .property-card { display: flex; gap: 1rem; background: white; border-radius: .75rem; border: 1px solid #E2E8F0; padding: 1rem; text-decoration: none; transition: box-shadow .15s; }
    .property-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.07); }
    .thumb { width: 64px; height: 64px; border-radius: .5rem; background: #F1F5F9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
    .thumb svg { width: 2rem; height: 2rem; color: #94A3B8; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }
    .name { font-weight: 600; color: #1E293B; margin: 0; font-size: .9375rem; }
    .address { font-size: .8125rem; color: #6B7280; margin: .25rem 0; }
    .type-badge { font-size: .75rem; background: #F1F5F9; color: #475569; padding: .2rem .5rem; border-radius: 999px; text-transform: capitalize; }
  `],
})
export class PropertiesListComponent implements OnInit {
  private readonly auth = inject(FirebaseAuthService);
  private readonly data = inject(FirebaseDataService);

  properties = signal<Property[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      if (!user) return;
      this.data.getCollection<Property>(`users/${user.uid}/properties`).subscribe((p) => {
        this.properties.set(p);
        this.isLoading.set(false);
      });
    });
  }
}
