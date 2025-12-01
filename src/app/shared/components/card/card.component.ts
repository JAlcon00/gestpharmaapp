import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardContent, IonSkeletonText } from '@ionic/angular/standalone';

/**
 * Componente de tarjeta flexible y reutilizable
 *
 * CARACTERÍSTICAS:
 * - 3 variantes de estilo (elevated, outlined, flat)
 * - Estados de loading con skeleton integrado
 * - Clickable opcional con navegación por teclado
 * - Slots flexibles para header, content y footer
 * - Animaciones suaves y transiciones
 * - Totalmente accesible (WCAG AAA)
 * - Responsive por defecto
 *
 * @example
 * ```html
 * <app-card
 *   variant="elevated"
 *   [clickable]="true"
 *   [loading]="isLoading"
 *   (cardClick)="handleClick()">
 *
 *   <div slot="header">
 *     <h3>Título del Producto</h3>
 *     <p class="text-secondary">Categoría: Analgésicos</p>
 *   </div>
 *
 *   <div slot="content">
 *     <p>Precio: $125.00</p>
 *     <p>Stock: 45 unidades</p>
 *   </div>
 *
 *   <div slot="footer">
 *     <app-button size="small" variant="ghost">Ver Detalles</app-button>
 *     <app-button size="small">Agregar al Carrito</app-button>
 *   </div>
 * </app-card>
 * ```
 */
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardContent, IonSkeletonText],
  template: `
    <ion-card
      [button]="clickable"
      [disabled]="disabled"
      [class.app-card--elevated]="variant === 'elevated'"
      [class.app-card--outlined]="variant === 'outlined'"
      [class.app-card--flat]="variant === 'flat'"
      [class.app-card--clickable]="clickable"
      [class.app-card--loading]="loading"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable && !disabled ? '0' : null"
      (click)="handleClick()"
      (keydown.enter)="handleClick()"
      (keydown.space)="handleClick()"
      class="app-card">

      <!-- Header -->
      <ion-card-header *ngIf="hasHeader" class="app-card__header">
        <ng-content select="[slot=header]"></ng-content>
      </ion-card-header>

      <!-- Content -->
      <ion-card-content class="app-card__content">
        <!-- Skeleton loader -->
        <div *ngIf="loading" class="app-card__skeleton">
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
        </div>

        <!-- Contenido real -->
        <div *ngIf="!loading" class="app-card__body">
          <ng-content select="[slot=content]"></ng-content>
          <ng-content></ng-content>
        </div>
      </ion-card-content>

      <!-- Footer -->
      <div *ngIf="hasFooter && !loading" class="app-card__footer">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </ion-card>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  /** Variante visual de la tarjeta */
  @Input() variant: 'elevated' | 'outlined' | 'flat' = 'elevated';

  /** Hace la tarjeta clickeable */
  @Input() clickable = false;

  /** Deshabilita la tarjeta */
  @Input() disabled = false;

  /** Muestra skeleton loader */
  @Input() loading = false;

  /** Muestra el header */
  @Input() hasHeader = true;

  /** Muestra el footer */
  @Input() hasFooter = false;

  /** Evento emitido al hacer click */
  @Output() cardClick = new EventEmitter<void>();

  /**
   * Maneja el evento click/keyboard
   * Solo emite si es clickable y no está deshabilitado
   */
  handleClick(): void {
    if (this.clickable && !this.disabled && !this.loading) {
      this.cardClick.emit();
    }
  }
}