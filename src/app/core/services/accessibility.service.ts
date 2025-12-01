import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

/**
 * Servicio para gestionar configuraciones de accesibilidad
 *
 * RESPONSABILIDADES:
 * - Detectar preferencias del sistema operativo
 * - Gestionar configuraciones personalizadas
 * - Aplicar ajustes visuales y de comportamiento
 * - Anunciar mensajes a lectores de pantalla
 * - Gestionar navegación por teclado
 *
 * @example
 * ```typescript
 * constructor(private a11yService: AccessibilityService) {
 *   this.a11yService.settings$.subscribe(settings => {
 *     if (settings.reducedMotion) {
 *       this.disableAnimations();
 *     }
 *   });
 * }
 *
 * // Anunciar cambio a lector de pantalla
 * this.a11yService.announce('Producto agregado al carrito', 'polite');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {

  private readonly STORAGE_KEY = 'gestpharma-a11y-settings';

  private settings$ = new BehaviorSubject<AccessibilitySettings>({
    highContrast: this.prefersHighContrast(),
    largeText: false,
    reducedMotion: this.prefersReducedMotion(),
    screenReaderMode: false,
    keyboardNavigation: true,
    focusIndicators: true
  });

  constructor() {
    this.loadSettings();
    this.applySettings();
    this.setupMediaQueryListeners();
    this.setupAriaLiveRegion();
  }

  /**
   * Observable de configuraciones de accesibilidad
   */
  getSettings$(): Observable<AccessibilitySettings> {
    return this.settings$.asObservable();
  }

  /**
   * Obtiene las configuraciones actuales
   */
  getSettings(): AccessibilitySettings {
    return this.settings$.value;
  }

  /**
   * Actualiza una configuración específica
   */
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): void {
    const current = this.settings$.value;
    this.settings$.next({
      ...current,
      [key]: value
    });
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Actualiza múltiples configuraciones
   */
  updateSettings(settings: Partial<AccessibilitySettings>): void {
    const current = this.settings$.value;
    this.settings$.next({
      ...current,
      ...settings
    });
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Detecta si el usuario prefiere alto contraste
   */
  private prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(prefers-contrast: more)').matches;
  }

  /**
   * Detecta si el usuario prefiere movimiento reducido
   */
  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Detecta si el usuario prefiere tema oscuro
   */
  prefersDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Carga configuraciones guardadas del localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings$.next({
          ...this.settings$.value,
          ...parsed
        });
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  }

  /**
   * Guarda configuraciones en localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.settings$.value)
      );
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  }

  /**
   * Aplica configuraciones al documento
   */
  private applySettings(): void {
    const root = document.documentElement;
    const settings = this.settings$.value;

    // Alto contraste
    root.classList.toggle('high-contrast', settings.highContrast);

    // Texto grande
    root.classList.toggle('large-text', settings.largeText);

    // Movimiento reducido
    root.classList.toggle('reduced-motion', settings.reducedMotion);

    // Modo lector de pantalla
    root.classList.toggle('screen-reader-mode', settings.screenReaderMode);

    // Indicadores de foco
    root.classList.toggle('focus-indicators', settings.focusIndicators);

    // Navegación por teclado
    if (settings.keyboardNavigation) {
      this.enableKeyboardNavigation();
    }
  }

  /**
   * Configura listeners para cambios en preferencias del sistema
   */
  private setupMediaQueryListeners(): void {
    // Cambio en preferencia de contraste
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    contrastQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.updateSetting('highContrast', true);
      }
    });

    // Cambio en preferencia de movimiento
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.updateSetting('reducedMotion', e.matches);
    });
  }

  /**
   * Crea región ARIA live para anuncios a lectores de pantalla
   */
  private setupAriaLiveRegion(): void {
    // Verificar si ya existe
    if (document.getElementById('aria-live-announcer')) {
      return;
    }

    // Crear elementos ARIA live
    const politeRegion = document.createElement('div');
    politeRegion.id = 'aria-live-announcer';
    politeRegion.setAttribute('role', 'status');
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.className = 'sr-only';

    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'aria-live-announcer-assertive';
    assertiveRegion.setAttribute('role', 'alert');
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';

    document.body.appendChild(politeRegion);
    document.body.appendChild(assertiveRegion);
  }

  /**
   * Anuncia un mensaje al lector de pantalla
   *
   * @param message - Mensaje a anunciar
   * @param priority - 'polite' (default) o 'assertive' para interrumpir
   *
   * @example
   * ```typescript
   * // Anuncio cortés (no interrumpe)
   * this.a11yService.announce('Producto agregado');
   *
   * // Anuncio urgente (interrumpe lectura actual)
   * this.a11yService.announce('Error: No se pudo guardar', 'assertive');
   * ```
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcerId = priority === 'assertive'
      ? 'aria-live-announcer-assertive'
      : 'aria-live-announcer';

    const announcer = document.getElementById(announcerId);
    if (announcer) {
      // Limpiar primero para forzar anuncio
      announcer.textContent = '';

      // Usar setTimeout para asegurar que el cambio se detecte
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);

      // Limpiar después de 5 segundos
      setTimeout(() => {
        announcer.textContent = '';
      }, 5000);
    }
  }

  /**
   * Habilita navegación por teclado mejorada
   */
  private enableKeyboardNavigation(): void {
    // Detectar si el usuario está usando teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  /**
   * Mueve el foco a un elemento específico
   */
  focusElement(selector: string, preventScroll = false): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus({ preventScroll });
      this.announce(`Enfocado en ${element.getAttribute('aria-label') || selector}`);
    }
  }

  /**
   * Crea un "skip link" para saltar contenido
   */
  createSkipLink(targetId: string, text: string): HTMLAnchorElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = text;
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.focusElement(`#${targetId}`);
    });
    return skipLink;
  }
}