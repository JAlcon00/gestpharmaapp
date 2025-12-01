import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonChip,
  IonButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

import { Product, Category } from '../../../../core/models';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

/**
 * Componente Dumb para mostrar lista de productos
 *
 * RESPONSABILIDADES:
 * - Mostrar productos en formato lista/card
 * - Emitir eventos de interacción (edit, delete, select)
 * - Manejar estados de carga y vacío
 * - No manejar lógica de negocio
 *
 * @example
 * ```html
 * <app-product-list
 *   [products]="products"
 *   [categories]="categories"
 *   [loading]="loading"
 *   [error]="error"
 *   (editProduct)="onEditProduct($event)"
 *   (deleteProduct)="onDeleteProduct($event)"
 *   (productSelected)="onProductSelected($event)">
 * </app-product-list>
 * ```
 */
@Component({
  selector: 'app-product-list',
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
    IonBadge,
    IonChip,
    IonButton,
    IonIcon,
    IonLabel,
    EmptyStateComponent,
    SkeletonComponent
  ],
  template: `
    <!-- Estado de carga -->
    <div *ngIf="loading" class="loading-container">
      <app-skeleton variant="card" [items]="6"></app-skeleton>
    </div>

    <!-- Estado de error -->
    <app-empty-state
      *ngIf="!loading && error"
      icon="alert-circle-outline"
      title="Error al cargar productos"
      [description]="error"
      actionLabel="Reintentar"
      actionIcon="refresh-outline"
      (actionClick)="retry.emit()">
    </app-empty-state>

    <!-- Lista vacía -->
    <app-empty-state
      *ngIf="!loading && !error && products.length === 0"
      icon="cube-outline"
      title="No hay productos"
      description="Aún no has agregado productos a tu inventario. Comienza agregando tu primer producto."
      actionLabel="Agregar Producto"
      actionIcon="add-circle-outline"
      (actionClick)="addProduct.emit()">
    </app-empty-state>

    <!-- Lista de productos -->
    <ion-list *ngIf="!loading && !error && products.length > 0" lines="none">
      <ion-item *ngFor="let product of products; trackBy: trackByProductId">
        <ion-card class="product-card" button (click)="productSelected.emit(product)">
          <ion-card-header>
            <div class="product-header">
              <div class="product-info">
                <ion-card-title class="product-name">{{ product.nombre }}</ion-card-title>
                <p class="product-description" *ngIf="product.descripcion">{{ product.descripcion }}</p>
                <div class="product-meta">
                  <span class="product-code" *ngIf="product.codigoBarras">
                    Código: {{ product.codigoBarras }}
                  </span>
                  <ion-chip
                    [color]="getCategoryColor(product.categoriaId)"
                    class="category-chip">
                    <ion-label>{{ getCategoryName(product.categoriaId) }}</ion-label>
                  </ion-chip>
                </div>
              </div>
              <div class="product-actions">
                <ion-button
                  fill="clear"
                  size="small"
                  (click)="$event.stopPropagation(); editProduct.emit(product)"
                  aria-label="Editar producto">
                  <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                </ion-button>
                <ion-button
                  fill="clear"
                  size="small"
                  color="danger"
                  (click)="$event.stopPropagation(); deleteProduct.emit(product)"
                  aria-label="Eliminar producto">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-card-header>

          <ion-card-content>
            <div class="product-details">
              <div class="price-section">
                <span class="price-label">Precio:</span>
                <span class="price-value">{{ product.precio | currency:'MXN':'symbol':'1.2-2' }}</span>
              </div>

              <div class="stock-section">
                <span class="stock-label">Stock:</span>
                <div class="stock-info">
                  <span class="stock-value">{{ product.stock }}</span>
                  <ion-badge
                    [color]="getStockStatus(product.stock, product.stockMinimo)"
                    class="stock-badge">
                    {{ getStockLabel(product.stock, product.stockMinimo) }}
                  </ion-badge>
                </div>
              </div>

              <div class="stock-min-section" *ngIf="product.stockMinimo && product.stockMinimo > 0">
                <span class="stock-min-label">Stock mínimo:</span>
                <span class="stock-min-value">{{ product.stockMinimo }}</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    .loading-container {
      padding: var(--spacing-md);
    }

    .product-card {
      margin: var(--spacing-sm) 0;
      width: 100%;

      ion-card-header {
        padding-bottom: 0;
      }
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: var(--spacing-md);
    }

    .product-info {
      flex: 1;
      min-width: 0; /* Permite truncar texto largo */
    }

    .product-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
      word-break: break-word;
    }

    .product-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-sm);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
      margin-bottom: var(--spacing-sm);
    }

    .product-code {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      font-family: var(--font-family-mono);
      background: var(--bg-tertiary);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
    }

    .category-chip {
      --background: var(--color-primary-100);
      --color: var(--color-primary-700);
      font-size: var(--font-size-xs);
    }

    .product-actions {
      display: flex;
      gap: var(--spacing-xs);
      flex-shrink: 0;
    }

    .product-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    .price-section,
    .stock-section,
    .stock-min-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .price-label,
    .stock-label,
    .stock-min-label {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      text-transform: uppercase;
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--letter-spacing-wider);
    }

    .price-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-success-600);
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .stock-value {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
    }

    .stock-badge {
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      font-weight: var(--font-weight-semibold);
    }

    .stock-min-value {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    /* Responsive */
    @media (max-width: 576px) {
      .product-details {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
      }

      .product-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-sm);
      }

      .product-actions {
        align-self: flex-end;
      }
    }
  `]
})
export class ProductListComponent {
  /** Lista de productos a mostrar */
  @Input() products: Product[] = [];

  /** Lista de categorías para mostrar nombres */
  @Input() categories: Category[] = [];

  /** Estado de carga */
  @Input() loading = false;

  /** Mensaje de error */
  @Input() error = '';

  /** Evento emitido cuando se solicita agregar producto */
  @Output() addProduct = new EventEmitter<void>();

  /** Evento emitido cuando se selecciona un producto */
  @Output() productSelected = new EventEmitter<Product>();

  /** Evento emitido cuando se solicita editar producto */
  @Output() editProduct = new EventEmitter<Product>();

  /** Evento emitido cuando se solicita eliminar producto */
  @Output() deleteProduct = new EventEmitter<Product>();

  /** Evento emitido cuando se solicita reintentar carga */
  @Output() retry = new EventEmitter<void>();

  constructor() {
    addIcons({ createOutline, trashOutline });
  }

  /**
   * TrackBy function para optimizar rendering de lista
   */
  trackByProductId(index: number, product: Product): number {
    return (product as any).id || index;
  }

  /**
   * Obtiene el nombre de la categoría por ID
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.nombre || 'Sin categoría';
  }

  /**
   * Obtiene el color para el chip de categoría
   */
  getCategoryColor(categoryId: number): string {
    // Colores rotativos para categorías
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    return colors[categoryId % colors.length] || 'primary';
  }

  /**
   * Obtiene el estado del stock para el badge
   */
  getStockStatus(stock: number, stockMinimo?: number): string {
    if (stock <= 0) return 'danger';
    if (stockMinimo && stock <= stockMinimo) return 'warning';
    return 'success';
  }

  /**
   * Obtiene la etiqueta del stock
   */
  getStockLabel(stock: number, stockMinimo?: number): string {
    if (stock <= 0) return 'Agotado';
    if (stockMinimo && stock <= stockMinimo) return 'Stock bajo';
    return 'Disponible';
  }
}