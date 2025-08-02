// src/app/app.ts (root component with inline template and styles)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; // Para mat-nav-list

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  template: `
    <mat-toolbar color="primary" *ngIf="isLoggedIn">
      <span>Librerías Católicas</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="container" *ngIf="isLoggedIn">
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">Dashboard</a>
          <a
            mat-list-item
            routerLink="/pos"
            *ngIf="role === 'Vendedor' || role === 'Admin'"
            >Punto de Venta</a
          >
          <a
            mat-list-item
            routerLink="/inventory"
            *ngIf="role === 'Almacén' || role === 'Admin' || role === 'Compras'"
            >Inventario</a
          >
          <!-- Agregar más enlaces según roles y wireframe -->
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <router-outlet *ngIf="!isLoggedIn"></router-outlet>
  `,
  styles: [
    `
      .container {
        height: calc(100vh - 64px); /* Ajuste para toolbar */
      }
      .spacer {
        flex: 1 1 auto;
      }
      mat-sidenav {
        width: 200px; /* Ancho minimalista para sidenav */
        background-color: var(--white);
        border-right: 1px solid var(--gray-light);
      }
      mat-nav-list a {
        color: var(--text-body);
        font-size: 14px;
      }
    `,
  ],
})
export class App {
  isLoggedIn = false; // Controlar con servicio de auth
  role = ''; // Obtenido de auth (e.g., 'Admin')

  logout() {
    // Implementar: Limpiar token, redirigir a login
    this.isLoggedIn = false;
  }
}
