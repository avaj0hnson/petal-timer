import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { ThemeService } from './services/theme.service';

export function initializeTheme(themeService: ThemeService): () => void {
  return () => themeService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideClientHydration(),
    {
    provide: APP_INITIALIZER,
    useFactory: initializeTheme,
    deps: [ThemeService],
    multi: true
    }
  ]
};
