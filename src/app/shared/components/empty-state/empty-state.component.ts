import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type EmptyStateType = 'products' | 'sales' | 'cart' | 'search' | 'reports' | 'clients' | 'inventory';

/**
 * Componente para estados vacíos ilustrados
 *
 * CUÁNDO USAR:
 * - Lista de productos vacía
 * - Sin resultados de búsqueda
 * - Sin ventas registradas
 * - Carrito vacío
 * - Sin notificaciones
 *
 * @example
 * ```html
 * <app-empty-state
 *   type="products"
 *   title="¡Aún no hay productos!"
 *   description="Agrega tu primer producto para comenzar a gestionar tu inventario."
 *   actionLabel="Agregar Producto"
 *   actionIcon="add-circle-outline"
 *   (actionClick)="navigateToAddProduct()">
 * </app-empty-state>
 * ```
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  /** Tipo de estado vacío (define la ilustración) */
  @Input() type: EmptyStateType = 'products';

  /** Título empático del estado vacío */
  @Input() title = '¡Aún no hay productos!';

  /** Descripción útil */
  @Input() description?: string;

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

  /** Genera ilustración SVG personalizada según el tipo */
  getIllustration(): string {
    const illustrations: Record<EmptyStateType, string> = {
      products: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="60" width="120" height="80" rx="8" fill="url(#products-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <rect x="50" y="70" width="40" height="40" rx="4" fill="var(--color-brand-secondary)" opacity="0.3"/>
          <rect x="100" y="70" width="40" height="40" rx="4" fill="var(--color-brand-accent)" opacity="0.3"/>
          <rect x="50" y="120" width="40" height="40" rx="4" fill="var(--color-brand-primary)" opacity="0.3"/>
          <rect x="100" y="120" width="40" height="40" rx="4" fill="var(--color-brand-secondary)" opacity="0.3"/>
          <circle cx="70" cy="90" r="8" fill="var(--color-brand-primary)"/>
          <circle cx="120" cy="90" r="8" fill="var(--color-brand-secondary)"/>
          <circle cx="70" cy="140" r="8" fill="var(--color-brand-accent)"/>
          <circle cx="120" cy="140" r="8" fill="var(--color-brand-primary)"/>
          <defs>
            <linearGradient id="products-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      sales: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 80 L140 80 L130 120 L70 120 Z" fill="url(#sales-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <rect x="75" y="85" width="50" height="25" rx="2" fill="var(--color-brand-secondary)" opacity="0.8"/>
          <circle cx="85" cy="97.5" r="3" fill="var(--color-brand-accent)"/>
          <circle cx="95" cy="97.5" r="3" fill="var(--color-brand-primary)"/>
          <circle cx="105" cy="97.5" r="3" fill="var(--color-brand-secondary)"/>
          <circle cx="115" cy="97.5" r="3" fill="var(--color-brand-accent)"/>
          <path d="M100 40 L90 60 L110 60 Z" fill="var(--color-success-500)" stroke="var(--color-success-600)" stroke-width="2"/>
          <text x="100" y="55" text-anchor="middle" fill="white" font-size="10" font-weight="bold">$</text>
          <defs>
            <linearGradient id="sales-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-success-400);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-success-500);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      cart: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 100 L130 100 L120 140 L80 140 Z" fill="url(#cart-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <circle cx="85" cy="105" r="8" fill="var(--color-brand-secondary)" opacity="0.5"/>
          <circle cx="115" cy="105" r="8" fill="var(--color-brand-accent)" opacity="0.5"/>
          <circle cx="100" cy="125" r="8" fill="var(--color-brand-primary)" opacity="0.5"/>
          <circle cx="75" cy="75" r="15" fill="var(--color-brand-primary)" stroke="var(--color-brand-secondary)" stroke-width="2"/>
          <path d="M65 75 L85 75 L80 85 Z" fill="var(--color-brand-secondary)"/>
          <circle cx="75" cy="75" r="3" fill="white"/>
          <defs>
            <linearGradient id="cart-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      search: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="70" r="25" fill="url(#search-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <circle cx="80" cy="70" r="15" fill="none" stroke="var(--color-brand-secondary)" stroke-width="2"/>
          <line x1="95" y1="85" x2="110" y2="100" stroke="var(--color-brand-primary)" stroke-width="3" stroke-linecap="round"/>
          <circle cx="125" cy="110" r="20" fill="var(--color-warning-400)" opacity="0.3"/>
          <text x="125" y="115" text-anchor="middle" fill="var(--color-warning-700)" font-size="16" font-weight="bold">?</text>
          <defs>
            <linearGradient id="search-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      reports: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="50" width="100" height="80" rx="4" fill="url(#reports-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <rect x="60" y="60" width="80" height="8" rx="2" fill="var(--color-brand-secondary)" opacity="0.6"/>
          <rect x="60" y="75" width="60" height="6" rx="2" fill="var(--color-brand-accent)" opacity="0.4"/>
          <rect x="60" y="85" width="70" height="6" rx="2" fill="var(--color-brand-primary)" opacity="0.4"/>
          <rect x="60" y="95" width="50" height="6" rx="2" fill="var(--color-brand-secondary)" opacity="0.4"/>
          <rect x="60" y="105" width="65" height="6" rx="2" fill="var(--color-brand-accent)" opacity="0.4"/>
          <circle cx="75" cy="75" r="3" fill="var(--color-success-500)"/>
          <circle cx="85" cy="85" r="3" fill="var(--color-warning-500)"/>
          <circle cx="95" cy="95" r="3" fill="var(--color-danger-500)"/>
          <defs>
            <linearGradient id="reports-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      clients: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="60" r="20" fill="url(#clients-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <circle cx="100" cy="60" r="8" fill="var(--color-brand-secondary)"/>
          <path d="M85 75 Q100 85 115 75" stroke="var(--color-brand-primary)" stroke-width="2" fill="none"/>
          <circle cx="75" cy="90" r="15" fill="var(--color-brand-accent)" opacity="0.6" stroke="var(--color-brand-secondary)" stroke-width="2"/>
          <circle cx="125" cy="90" r="15" fill="var(--color-brand-primary)" opacity="0.6" stroke="var(--color-brand-secondary)" stroke-width="2"/>
          <circle cx="75" cy="90" r="5" fill="var(--color-brand-secondary)"/>
          <circle cx="125" cy="90" r="5" fill="var(--color-brand-primary)"/>
          <path d="M70 100 Q75 105 80 100" stroke="var(--color-brand-accent)" stroke-width="2" fill="none"/>
          <path d="M120 100 Q125 105 130 100" stroke="var(--color-brand-primary)" stroke-width="2" fill="none"/>
          <defs>
            <linearGradient id="clients-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      inventory: `
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="70" width="120" height="60" rx="6" fill="url(#inventory-bg)" stroke="var(--color-brand-primary)" stroke-width="2"/>
          <rect x="50" y="80" width="30" height="20" rx="2" fill="var(--color-brand-secondary)" opacity="0.7"/>
          <rect x="85" y="80" width="30" height="20" rx="2" fill="var(--color-brand-accent)" opacity="0.7"/>
          <rect x="120" y="80" width="30" height="20" rx="2" fill="var(--color-brand-primary)" opacity="0.7"/>
          <rect x="50" y="105" width="30" height="15" rx="2" fill="var(--color-brand-accent)" opacity="0.5"/>
          <rect x="85" y="105" width="30" height="15" rx="2" fill="var(--color-brand-primary)" opacity="0.5"/>
          <rect x="120" y="105" width="30" height="15" rx="2" fill="var(--color-brand-secondary)" opacity="0.5"/>
          <circle cx="65" cy="90" r="4" fill="var(--color-success-500)"/>
          <circle cx="100" cy="90" r="4" fill="var(--color-warning-500)"/>
          <circle cx="135" cy="90" r="4" fill="var(--color-danger-500)"/>
          <defs>
            <linearGradient id="inventory-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-brand-primary);stop-opacity:0.1"/>
              <stop offset="100%" style="stop-color:var(--color-brand-secondary);stop-opacity:0.1"/>
            </linearGradient>
          </defs>
        </svg>
      `
    };

    return illustrations[this.type] || illustrations.products;
  }
}