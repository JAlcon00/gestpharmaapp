import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonSpinner, IonIcon } from '@ionic/angular/standalone';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' |
                            'warning' | 'ghost' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Componente de botón reutilizable con múltiples variantes y estados
 *
 * CARACTERÍSTICAS:
 * - 7 variantes visuales
 * - 3 tamaños
 * - Estado de carga integrado
 * - Iconos opcionales (start/end)
 * - Totalmente accesible
 * - Deshabilitado automático durante carga
 *
 * @example
 * ```html
 * <app-button
 *   variant="primary"
 *   size="medium"
 *   [loading]="isSubmitting"
 *   [disabled]="!isValid"
 *   iconStart="add-circle-outline"
 *   ariaLabel="Agregar nuevo producto"
 *   (clicked)="handleAddProduct()">
 *   Agregar Producto
 * </app-button>
 * ```
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonButton, IonSpinner, IonIcon],
  template: `
    <ion-button
      [color]="getColor()"
      [fill]="getFill()"
      [size]="size"
      [expand]="expand"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-busy]="loading"
      [attr.aria-disabled]="disabled || loading"
      (click)="handleClick($event)"
      class="app-button app-button--{{variant}} app-button--{{size}}"
      [class.app-button--loading]="loading">

      <!-- Spinner de carga -->
      <ion-spinner
        *ngIf="loading"
        name="crescent"
        slot="start"
        class="app-button__spinner">
      </ion-spinner>

      <!-- Icono inicial -->
      <ion-icon
        *ngIf="iconStart && !loading"
        [name]="iconStart"
        slot="start"
        class="app-button__icon app-button__icon--start"
        [attr.aria-hidden]="true">
      </ion-icon>

      <!-- Contenido del botón -->
      <span class="app-button__content">
        <ng-content></ng-content>
      </span>

      <!-- Icono final -->
      <ion-icon
        *ngIf="iconEnd && !loading"
        [name]="iconEnd"
        slot="end"
        class="app-button__icon app-button__icon--end"
        [attr.aria-hidden]="true">
      </ion-icon>
    </ion-button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  /** Variante visual del botón */
  @Input() variant: ButtonVariant = 'primary';

  /** Tamaño del botón */
  @Input() size: ButtonSize = 'medium';

  /** Expande el botón al ancho completo */
  @Input() expand?: 'block' | 'full';

  /** Deshabilita el botón */
  @Input() disabled = false;

  /** Muestra spinner y deshabilita el botón */
  @Input() loading = false;

  /** Icono al inicio del botón */
  @Input() iconStart?: string;

  /** Icono al final del botón */
  @Input() iconEnd?: string;

  /** Etiqueta ARIA para accesibilidad */
  @Input() ariaLabel?: string;

  /** Evento emitido al hacer click */
  @Output() clicked = new EventEmitter<Event>();

  /**
   * Mapea variante a color de Ionic
   */
  getColor(): string {
    const colorMap: Record<ButtonVariant, string> = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      danger: 'danger',
      warning: 'warning',
      ghost: 'medium',
      link: 'primary'
    };
    return colorMap[this.variant];
  }

  /**
   * Mapea variante a fill de Ionic
   */
  getFill(): 'solid' | 'outline' | 'clear' {
    if (this.variant === 'ghost') return 'clear';
    if (this.variant === 'link') return 'clear';
    return 'solid';
  }

  /**
   * Maneja el evento click
   * Solo emite si no está deshabilitado ni cargando
   */
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}