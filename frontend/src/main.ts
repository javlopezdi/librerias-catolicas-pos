// src/main.ts (actualizado para bootstrap del root component en app.ts)
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Importa desde app.ts
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material providers
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

// Import routes
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom([
      FormsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatSidenavModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatSelectModule,
      MatTableModule,
      MatDialogModule,
      // Agrega MatListModule si no está
    ]),
  ],
}).catch((err) => console.error(err));
