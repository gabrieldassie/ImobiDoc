import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../data/firebase';
import { FirebaseDataService } from '../../data/firebase';
import type { AuthUser } from '../../core/interfaces';
import type { Property, MaintenanceLog } from '../../data/models';

interface DashboardStats {
  totalProperties: number;
  pendingMaintenance: number;
  completedThisMonth: number;
  totalCostThisYear: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(FirebaseAuthService);
  private readonly dataService = inject(FirebaseDataService);

  currentUser = signal<AuthUser | null>(null);
  stats = signal<DashboardStats>({ totalProperties: 0, pendingMaintenance: 0, completedThisMonth: 0, totalCostThisYear: 0 });
  recentLogs = signal<MaintenanceLog[]>([]);
  properties = signal<Property[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) this.loadDashboardData(user.uid);
    });
  }

  private loadDashboardData(userId: string): void {
    this.dataService.getCollection<Property>(`users/${userId}/properties`).subscribe((props) => {
      this.properties.set(props);
      this.stats.update((s) => ({ ...s, totalProperties: props.length }));
      this.isLoading.set(false);
    });
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = { low: 'priority-low', medium: 'priority-medium', high: 'priority-high', critical: 'priority-critical' };
    return map[priority] ?? 'priority-medium';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { pending: 'status-pending', in_progress: 'status-info', completed: 'status-success', cancelled: 'status-error' };
    return map[status] ?? 'status-neutral';
  }
}
