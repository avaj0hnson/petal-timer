import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../models/theme.model';
import { THEMES } from '../constants/theme';

const STORAGE_KEY = 'selectedTheme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themes: Theme[] = THEMES;
  private currentThemeSubject!: BehaviorSubject<Theme>;
  currentTheme$!: Observable<Theme>;
  private themeReadySubject = new BehaviorSubject<boolean>(false);
  themeReady$ = this.themeReadySubject.asObservable();
  
  initialize(): void {
    const theme = this.isBrowser() ? this.getInitialTheme() : this.themes[0];

    this.currentThemeSubject = new BehaviorSubject<Theme>(theme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();

    this.applyThemeClass(theme);
    this.themeReadySubject.next(true);
  }

  switchTheme(name: string): void {
    const theme = this.themes.find(t => t.name === name);
    if (!theme) return;

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY, name);
    }

    this.applyThemeClass(theme);
    this.currentThemeSubject.next(theme);
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);

    const found = this.themes.find(t => t.name === stored);

    return found ?? this.themes[0];
  }

  private applyThemeClass(theme: Theme): void {
    if (!this.isBrowser()) return;

    this.themes.forEach(t => document.body.classList.remove(t.rootClass));
    document.body.classList.add(theme.rootClass);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
