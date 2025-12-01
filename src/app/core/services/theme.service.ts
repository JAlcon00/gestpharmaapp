import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private currentTheme$ = new BehaviorSubject<Theme>('system');

  constructor() {
    this.initializeTheme();
  }

  get currentTheme() {
    return this.currentTheme$.value;
  }

  get theme$() {
    return this.currentTheme$.asObservable();
  }

  /**
   * Inicializa el tema basado en las preferencias guardadas o del sistema
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme: Theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(initialTheme, false);

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Establece el tema de la aplicación
   */
  setTheme(theme: Theme, saveToStorage = true): void {
    this.currentTheme$.next(theme);

    if (saveToStorage) {
      localStorage.setItem('theme', theme);
    }

    const actualTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    this.applyTheme(actualTheme);
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.documentElement.classList.remove('light-theme', 'dark-theme');
    this.document.documentElement.classList.add(`${theme}-theme`);
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Verifica si el tema actual es oscuro
   */
  isDarkTheme(): boolean {
    const actualTheme = this.currentTheme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : this.currentTheme;

    return actualTheme === 'dark';
  }
}