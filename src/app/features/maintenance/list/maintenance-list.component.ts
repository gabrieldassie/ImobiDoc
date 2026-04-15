import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService, FirebaseDataService } from '../../../data/firebase';
import type { MaintenanceLog } from '../../../data/models';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <h1>Manutenções</h1>
        <a routerLink="/maintenance/new" class="btn-add">+ Nova Manutenção</a>
      </div>
      @if (isLoading()) {
        <p class="loading-text">Carregando...</p>
      } @else if (logs().length === 0) {
        <div class="empty">
          <div class="empty-icon">🔧</div>
          <h2>Nenhuma manutenção registrada</h2>
          <a routerLink="/maintenance/new" class="btn-add">Registrar Manutenção</a>
        </div>
      } @else {
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Custo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr>
                  <td class="title-cell">{{ log.title }}</td>
                  <td>{{ log.category }}</td>
                  <td><span class="badge" [ngClass]="getStatusClass(log.status)">{{ log.status }}</span></td>
                  <td><span class="badge" [ngClass]="getPriorityClass(log.priority)">{{ log.priority }}</span></td>
                  <td>{{ log.cost ? (log.cost | currency:'BRL') : '-' }}</td>
                  <td><a [routerLink]="['/maintenance', log.id]" class="edit-link">Editar</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #1E293B; margin: 0; }
    .btn-add { padding: .5rem 1rem; background: #10B981; color: white; border-radius: .5rem; font-weight: 600; font-size: .875rem; text-decoration: none; }
    .empty { text-align: center; padding: 4rem 1rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty h2 { font-size: 1.25rem; color: #1E293B; margin-bottom: 1rem; }
    .loading-text { color: #6B7280; }
    .table-wrapper { background: white; border-radius: .75rem; border: 1px solid #E2E8F0; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: .875rem 1rem; background: #F9FAFB; font-size: .8125rem; color: #6B7280; font-weight: 600; border-bottom: 1px solid #E2E8F0; }
    td { padding: .875rem 1rem; font-size: .875rem; color: #374151; border-bottom: 1px solid #F9FAFB; }
    .title-cell { font-weight: 500; color: #1E293B; }
    .badge { padding: .2rem .625rem; border-radius: 9999px; font-size: .75rem; font-weight: 600; }
    .status-pending { background: #FEF3C7; color: #92400E; }
    .status-in_progress { background: #DBEAFE; color: #1E40AF; }
    .status-completed { background: #D1FAE5; color: #065F46; }
    .status-cancelled { background: #F3F4F6; color: #374151; }
    .priority-low { background: #D1FAE5; color: #065F46; }
    .priority-medium { background: #FEF3C7; color: #92400E; }
    .priority-high { background: #FED7AA; color: #9A3412; }
    .priority-critical { background: #FEE2E2; color: #991B1B; }
    .edit-link { color: #10B981; font-size: .875rem; text-decoration: none; font-weight: 500; }
  `],
})
export class MaintenanceListComponent implements OnInit {
  private readonly auth = inject(FirebaseAuthService);
  private readonly data = inject(FirebaseDataService);

  logs = signal<MaintenanceLog[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      if (!user) return;
      this.data.getCollection<MaintenanceLog>(
        `users/${user.uid}/maintenanceLogs`
      ).subscribe((l) => { this.logs.set(l); this.isLoading.set(false); });
    });
  }

  getStatusClass(s: string): string {
    return { pending: 'status-pending', in_progress: 'status-in_progress', completed: 'status-completed', cancelled: 'status-cancelled' }[s] ?? '';
  }

  getPriorityClass(p: string): string {
    return { low: 'priority-low', medium: 'priority-medium', high: 'priority-high', critical: 'priority-critical' }[p] ?? '';
  }
}
