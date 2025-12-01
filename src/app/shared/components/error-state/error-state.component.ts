import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Componente para estados de error amigables
 *
 * CUÁNDO USAR:
 * - Error de conexión a internet
 * - Error 404 - Página no encontrada
 * - Error 500 - Error del servidor
 * - Error de permisos
 * - Sesión expirada
 *
 * @example
 * ```html
 * <app-error-state
 *   severity="error"
 *   title="¡Ups! Algo salió mal"
 *   description="No pudimos cargar la información. Verifica tu conexión a internet."
 *   actionLabel="Reintentar"
 *   actionIcon="refresh-outline"
 *   (actionClick)="retryLoad()">
 * </app-error-state>
 * ```
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent {
  /** Severidad del error (afecta colores e ilustración) */
  @Input() severity: ErrorSeverity = 'error';

  /** Título del error */
  @Input() title = '¡Ups! Algo salió mal';

  /** Descripción del error */
  @Input() description?: string;

  /** Código de error (opcional, solo para desarrollo) */
  @Input() errorCode?: string;

  /** Mostrar código de error */
  @Input() showErrorCode = false;

  /** Etiqueta del botón de acción principal */
  @Input() actionLabel?: string;

  /** Icono del botón de acción */
  @Input() actionIcon?: string;

  /** Variante del botón de acción */
  @Input() actionVariant: 'primary' | 'secondary' = 'primary';

  /** Etiqueta del botón secundario */
  @Input() secondaryActionLabel?: string;

  /** Icono del botón secundario */
  @Input() secondaryActionIcon?: string;

  /** Evento de acción principal */
  @Output() actionClick = new EventEmitter<void>();

  /** Evento de acción secundaria */
  @Output() secondaryActionClick = new EventEmitter<void>();

  /** Genera ilustración SVG según la severidad */
  getIllustration(): string {
    const illustrations: Record<ErrorSeverity, string> = {
      error: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="40" fill="url(#error-bg)" stroke="var(--color-danger-500)" stroke-width="3"/>
          <path d="M85 65 L115 95 M115 65 L85 95" stroke="var(--color-danger-600)" stroke-width="4" stroke-linecap="round"/>
          <circle cx="100" cy="80" r="35" fill="none" stroke="var(--color-danger-400)" stroke-width="2" stroke-dasharray="10,5" opacity="0.5">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 100 80" to="360 100 80" dur="3s" repeatCount="indefinite"/>
          </circle>
          <defs>
            <radialGradient id="error-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:var(--color-danger-400);stop-opacity:0.3"/>
              <stop offset="100%" style="stop-color:var(--color-danger-500);stop-opacity:0.1"/>
            </radialGradient>
          </defs>
        </svg>
      `,
      warning: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 30 L160 130 L40 130 Z" fill="url(#warning-bg)" stroke="var(--color-warning-500)" stroke-width="3"/>
          <circle cx="100" cy="110" r="8" fill="var(--color-warning-600)"/>
          <rect x="95" y="85" width="10" height="20" rx="2" fill="var(--color-warning-600)"/>
          <circle cx="100" cy="75" r="3" fill="var(--color-warning-600)"/>
          <path d="M92 45 L96 55 M96 45 L100 55 M100 45 L104 55 M104 45 L108 55" stroke="var(--color-warning-700)" stroke-width="2" stroke-linecap="round"/>
          <defs>
            <linearGradient id="warning-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-warning-400);stop-opacity:0.3"/>
              <stop offset="100%" style="stop-color:var(--color-warning-500);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      info: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="40" fill="url(#info-bg)" stroke="var(--color-info-500)" stroke-width="3"/>
          <rect x="95" y="65" width="10" height="25" rx="2" fill="var(--color-info-600)"/>
          <circle cx="100" cy="95" r="3" fill="var(--color-info-600)"/>
          <path d="M85 45 Q100 35 115 45" stroke="var(--color-info-600)" stroke-width="3" fill="none"/>
          <circle cx="100" cy="80" r="35" fill="none" stroke="var(--color-info-400)" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
            <animateTransform attributeName="transform" attributeType="XML" type="scale" values="1;1.1;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <defs>
            <radialGradient id="info-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:var(--color-info-400);stop-opacity:0.3"/>
              <stop offset="100%" style="stop-color:var(--color-info-500);stop-opacity:0.1"/>
            </radialGradient>
          </defs>
        </svg>
      `
    };

    return illustrations[this.severity] || illustrations.error;
  }
}