import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { DesignTokens } from '../../../theme/design-tokens';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Servicio para gestión responsive y breakpoints
 *
 * CARACTERÍSTICAS:
 * - Observable de breakpoint actual
 * - Utilidades para mostrar/ocultar elementos
 * - Detección automática de cambios
 * - Soporte para orientación (portrait/landscape)
 *
 * @example
 * ```typescript
 * constructor(private breakpoint: BreakpointService) {
 *   this.breakpoint.current$.subscribe(bp => {
 *     console.log('Breakpoint actual:', bp);
 *   });
 * }
 *
 * // En template
 * <div *ngIf="breakpoint.isAtLeast('md')">Visible en MD y superior</div>
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private currentBreakpoint$ = new BehaviorSubject<Breakpoint>('md');
  private currentOrientation$ = new BehaviorSubject<'portrait' | 'landscape'>('portrait');

  constructor() {
    this.initializeBreakpointDetection();
    this.initializeOrientationDetection();
  }

  /**
   * Observable del breakpoint actual
   */
  get current$(): Observable<Breakpoint> {
    return this.currentBreakpoint$.asObservable();
  }

  /**
   * Breakpoint actual
   */
  get current(): Breakpoint {
    return this.currentBreakpoint$.value;
  }

  /**
   * Observable de la orientación actual
   */
  get orientation$(): Observable<'portrait' | 'landscape'> {
    return this.currentOrientation$.asObservable();
  }

  /**
   * Orientación actual
   */
  get orientation(): 'portrait' | 'landscape' {
    return this.currentOrientation$.value;
  }

  /**
   * Verifica si el breakpoint actual es al menos el especificado
   *
   * @example
   * ```typescript
   * // Retorna true si es 'md', 'lg', 'xl', 'xxl'
   * this.breakpoint.isAtLeast('md');
   * ```
   */
  isAtLeast(breakpoint: Breakpoint): boolean {
    const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = order.indexOf(this.current);
    const targetIndex = order.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }

  /**
   * Verifica si el breakpoint actual es exactamente el especificado
   */
  isExactly(breakpoint: Breakpoint): boolean {
    return this.current === breakpoint;
  }

  /**
   * Verifica si el breakpoint actual es menor al especificado
   */
  isLessThan(breakpoint: Breakpoint): boolean {
    return !this.isAtLeast(breakpoint);
  }

  /**
   * Verifica si está en modo portrait
   */
  isPortrait(): boolean {
    return this.orientation === 'portrait';
  }

  /**
   * Verifica si está en modo landscape
   */
  isLandscape(): boolean {
    return this.orientation === 'landscape';
  }

  /**
   * Obtiene el ancho mínimo para un breakpoint
   */
  getBreakpointMinWidth(breakpoint: Breakpoint): number {
    const breakpoints = DesignTokens.breakpoints;
    return parseInt(breakpoints[breakpoint].replace('px', ''));
  }

  /**
   * Inicializa la detección de cambios de breakpoint
   */
  private initializeBreakpointDetection(): void {
    if (typeof window === 'undefined') return;

    // Crear media queries para cada breakpoint
    const breakpointQueries: Record<Breakpoint, MediaQueryList> = {
      xs: window.matchMedia(`(max-width: ${DesignTokens.breakpoints.sm})`),
      sm: window.matchMedia(`(min-width: ${DesignTokens.breakpoints.sm}) and (max-width: ${DesignTokens.breakpoints.md})`),
      md: window.matchMedia(`(min-width: ${DesignTokens.breakpoints.md}) and (max-width: ${DesignTokens.breakpoints.lg})`),
      lg: window.matchMedia(`(min-width: ${DesignTokens.breakpoints.lg}) and (max-width: ${DesignTokens.breakpoints.xl})`),
      xl: window.matchMedia(`(min-width: ${DesignTokens.breakpoints.xl}) and (max-width: ${DesignTokens.breakpoints.xxl})`),
      xxl: window.matchMedia(`(min-width: ${DesignTokens.breakpoints.xxl})`)
    };

    // Función para determinar el breakpoint actual
    const getCurrentBreakpoint = (): Breakpoint => {
      const width = window.innerWidth;

      if (width >= this.getBreakpointMinWidth('xxl')) return 'xxl';
      if (width >= this.getBreakpointMinWidth('xl')) return 'xl';
      if (width >= this.getBreakpointMinWidth('lg')) return 'lg';
      if (width >= this.getBreakpointMinWidth('md')) return 'md';
      if (width >= this.getBreakpointMinWidth('sm')) return 'sm';
      return 'xs';
    };

    // Establecer breakpoint inicial
    this.currentBreakpoint$.next(getCurrentBreakpoint());

    // Escuchar cambios en el tamaño de la ventana
    fromEvent(window, 'resize')
      .pipe(
        map(() => getCurrentBreakpoint()),
        startWith(getCurrentBreakpoint()),
        distinctUntilChanged()
      )
      .subscribe(breakpoint => {
        this.currentBreakpoint$.next(breakpoint);
      });

    // Escuchar cambios en media queries (más eficiente)
    Object.entries(breakpointQueries).forEach(([bp, query]) => {
      query.addEventListener('change', (e) => {
        if (e.matches) {
          this.currentBreakpoint$.next(bp as Breakpoint);
        }
      });
    });
  }

  /**
   * Inicializa la detección de cambios de orientación
   */
  private initializeOrientationDetection(): void {
    if (typeof window === 'undefined' || !window.screen) return;

    const getOrientation = (): 'portrait' | 'landscape' => {
      return window.screen.orientation?.type?.includes('portrait') ||
             window.innerHeight > window.innerWidth
        ? 'portrait'
        : 'landscape';
    };

    // Establecer orientación inicial
    this.currentOrientation$.next(getOrientation());

    // Escuchar cambios de orientación
    window.screen.orientation?.addEventListener('change', () => {
      this.currentOrientation$.next(getOrientation());
    });

    // Fallback para navegadores sin screen.orientation
    fromEvent(window, 'orientationchange')
      .pipe(
        map(() => getOrientation()),
        distinctUntilChanged()
      )
      .subscribe(orientation => {
        this.currentOrientation$.next(orientation);
      });
  }
}