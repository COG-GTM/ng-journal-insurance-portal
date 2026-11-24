import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { InsurancePortalPreset } from './theme';
import { provideFeatureFlags } from '@ng-journal/shared/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding()
    ),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: InsurancePortalPreset,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    provideHttpClient(),
    provideFeatureFlags(),
    MessageService,
  ],
};
