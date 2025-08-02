// src/app/components/dashboard/dashboard.ts (standalone component with inline template and styles)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
// Agrega más imports según necesites (e.g., MatTableModule para tablas, gráficos con ng2-charts si instalas)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <mat-card class="metric-card">
        <mat-card-header>
          <mat-card-title>Ventas del Día</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Gráfico o métrica simple; usa ngIf para datos cargados -->
          <p>Métrica en desarrollo</p>
        </mat-card-content>
      </mat-card>
      <!-- Agrega más tarjetas minimalistas para otras métricas -->
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
        padding: 16px;
      }
      .metric-card {
        height: 200px; /* Altura fija para balance */
      }
    `,
  ],
})
export class DashboardComponent {
  // Lógica para cargar datos de API (usa servicio)
}
