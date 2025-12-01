import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

import { Category } from '../../../../core/models';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

/**
 * Componente Dumb para mostrar lista de categorías
 *
 * RESPONSABILIDADES:
 * - Mostrar categorías en formato lista
 * - Emitir eventos de interacción (edit, delete, select)
 * - Manejar estados de carga y vacío
 * - No manejar lógica de negocio
 */
@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    EmptyStateComponent
  ],
  template: `
    <!-- Lista vacía -->
    <app-empty-state
      *ngIf="categories.length === 0"
      icon="folder-outline"
      title="No hay categorías"
      description="Crea tu primera categoría para organizar tus productos."
      actionLabel="Agregar Categoría"
      actionIcon="add-circle-outline"
      (actionClick)="addCategory.emit()">
    </app-empty-state>

    <!-- Lista de categorías -->
    <ion-list *ngIf="categories.length > 0" lines="none">
      <ion-item *ngFor="let category of categories; trackBy: trackByCategoryId">
        <ion-card class="category-card" button (click)="categorySelected.emit(category)">
          <ion-card-header>
            <div class="category-header">
              <div class="category-info">
                <ion-card-title class="category-name">{{ category.nombre }}</ion-card-title>
                <p class="category-description" *ngIf="category.descripcion">
                  {{ category.descripcion }}
                </p>
              </div>
              <div class="category-actions">
                <ion-button
                  fill="clear"
                  size="small"
                  (click)="$event.stopPropagation(); editCategory.emit(category)"
                  aria-label="Editar categoría">
                  <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                </ion-button>
                <ion-button
                  fill="clear"
                  size="small"
                  color="danger"
                  (click)="$event.stopPropagation(); deleteCategory.emit(category)"
                  aria-label="Eliminar categoría">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-card-header>

          <ion-card-content *ngIf="showProductCount">
            <div class="category-stats">
              <ion-badge color="primary" class="product-count">
                {{ getProductCount(category.id) }} productos
              </ion-badge>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    .category-card {
      margin: var(--spacing-sm) 0;
      width: 100%;

      ion-card-header {
        padding-bottom: var(--spacing-sm);
      }
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: var(--spacing-md);
    }

    .category-info {
      flex: 1;
      min-width: 0;
    }

    .category-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
      word-break: break-word;
    }

    .category-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .category-actions {
      display: flex;
      gap: var(--spacing-xs);
      flex-shrink: 0;
    }

    .category-stats {
      margin-top: var(--spacing-sm);
    }

    .product-count {
      font-size: var(--font-size-xs);
      text-transform: none;
    }

    /* Responsive */
    @media (max-width: 576px) {
      .category-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-sm);
      }

      .category-actions {
        align-self: flex-end;
      }
    }
  `]
})
export class CategoryListComponent {
  /** Lista de categorías a mostrar */
  @Input() categories: Category[] = [];

  /** Mapa de conteo de productos por categoría */
  @Input() productCountByCategory: Map<number, number> = new Map();

  /** Mostrar conteo de productos */
  @Input() showProductCount = false;

  /** Evento emitido cuando se solicita agregar categoría */
  @Output() addCategory = new EventEmitter<void>();

  /** Evento emitido cuando se selecciona una categoría */
  @Output() categorySelected = new EventEmitter<Category>();

  /** Evento emitido cuando se solicita editar categoría */
  @Output() editCategory = new EventEmitter<Category>();

  /** Evento emitido cuando se solicita eliminar categoría */
  @Output() deleteCategory = new EventEmitter<Category>();

  constructor() {
    addIcons({ createOutline, trashOutline });
  }

  /**
   * TrackBy function para optimizar rendering de lista
   */
  trackByCategoryId(index: number, category: Category): number {
    return category.id || index;
  }

  /**
   * Obtiene el número de productos en una categoría
   */
  getProductCount(categoryId: number): number {
    return this.productCountByCategory.get(categoryId) || 0;
  }
}