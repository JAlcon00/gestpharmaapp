import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * INTERFACES DE EVENTOS
 */

export interface AppEvent {
  type: string;
  payload?: any;
  timestamp?: number;
  source?: string;
}

/**
 * TIPOS DE EVENTOS PREDEFINIDOS
 */

export const EVENT_TYPES = {
  // Productos
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  PRODUCT_STOCK_LOW: 'product:stock_low',
  PRODUCT_OUT_OF_STOCK: 'product:out_of_stock',

  // Categorías
  CATEGORY_CREATED: 'category:created',
  CATEGORY_UPDATED: 'category:updated',
  CATEGORY_DELETED: 'category:deleted',

  // Carrito
  CART_ITEM_ADDED: 'cart:item_added',
  CART_ITEM_UPDATED: 'cart:item_updated',
  CART_ITEM_REMOVED: 'cart:item_removed',
  CART_CLEARED: 'cart:cleared',

  // Ventas
  SALE_COMPLETED: 'sale:completed',
  SALE_CANCELLED: 'sale:cancelled',

  // Usuario
  USER_LOGGED_IN: 'user:logged_in',
  USER_LOGGED_OUT: 'user:logged_out',
  USER_PROFILE_UPDATED: 'user:profile_updated',

  // Sistema
  NETWORK_ONLINE: 'system:network_online',
  NETWORK_OFFLINE: 'system:network_offline',
  SYNC_COMPLETED: 'system:sync_completed',
  SYNC_FAILED: 'system:sync_failed',

  // UI
  TOAST_SUCCESS: 'ui:toast_success',
  TOAST_ERROR: 'ui:toast_error',
  TOAST_WARNING: 'ui:toast_warning',
  TOAST_INFO: 'ui:toast_info',
  MODAL_OPENED: 'ui:modal_opened',
  MODAL_CLOSED: 'ui:modal_closed'
} as const;

/**
 * EVENT BUS SERVICE
 *
 * Patrón Publish-Subscribe para comunicación desacoplada entre componentes.
 * Permite que componentes se comuniquen sin conocerse directamente.
 *
 * @example
 * ```typescript
 * // Publicar evento
 * this.eventBus.publish({
 *   type: EVENT_TYPES.PRODUCT_CREATED,
 *   payload: { product: newProduct },
 *   source: 'ProductFormComponent'
 * });
 *
 * // Suscribirse a eventos
 * this.eventBus.on(EVENT_TYPES.PRODUCT_CREATED).subscribe(event => {
 *   console.log('Producto creado:', event.payload.product);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private eventSubject = new Subject<AppEvent>();
  private eventHistory: AppEvent[] = [];
  private readonly MAX_HISTORY = 100;

  /**
   * Publica un evento en el bus
   */
  publish(event: Omit<AppEvent, 'timestamp'>): void {
    const fullEvent: AppEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Agregar a historial
    this.eventHistory.push(fullEvent);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift(); // Remover eventos antiguos
    }

    // Emitir evento
    this.eventSubject.next(fullEvent);

    // Logging en desarrollo
    if (!environment.production) {
      console.log(`📢 EventBus: ${fullEvent.type}`, fullEvent);
    }
  }

  /**
   * Se suscribe a todos los eventos
   */
  get events$(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }

  /**
   * Se suscribe a eventos de un tipo específico
   */
  on(eventType: string): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => event.type === eventType)
    );
  }

  /**
   * Se suscribe a eventos de múltiples tipos
   */
  onMultiple(eventTypes: string[]): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => eventTypes.includes(event.type))
    );
  }

  /**
   * Se suscribe a eventos que coinciden con un patrón
   */
  onPattern(pattern: RegExp): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => pattern.test(event.type))
    );
  }

  /**
   * Obtiene el historial de eventos
   */
  getHistory(): AppEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Obtiene eventos recientes de un tipo específico
   */
  getRecentEvents(eventType: string, limit: number = 10): AppEvent[] {
    return this.eventHistory
      .filter(event => event.type === eventType)
      .slice(-limit);
  }

  /**
   * Limpia el historial de eventos
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * MÉTODOS DE CONVENIENCIA PARA EVENTOS COMUNES
   */

  // Productos
  productCreated(product: any, source?: string): void {
    this.publish({
      type: EVENT_TYPES.PRODUCT_CREATED,
      payload: { product },
      source
    });
  }

  productUpdated(product: any, source?: string): void {
    this.publish({
      type: EVENT_TYPES.PRODUCT_UPDATED,
      payload: { product },
      source
    });
  }

  productDeleted(productId: number, source?: string): void {
    this.publish({
      type: EVENT_TYPES.PRODUCT_DELETED,
      payload: { productId },
      source
    });
  }

  // Carrito
  cartItemAdded(product: any, quantity: number, source?: string): void {
    this.publish({
      type: EVENT_TYPES.CART_ITEM_ADDED,
      payload: { product, quantity },
      source
    });
  }

  cartItemRemoved(productId: number, source?: string): void {
    this.publish({
      type: EVENT_TYPES.CART_ITEM_REMOVED,
      payload: { productId },
      source
    });
  }

  cartCleared(source?: string): void {
    this.publish({
      type: EVENT_TYPES.CART_CLEARED,
      source
    });
  }

  // Sistema
  networkOnline(source?: string): void {
    this.publish({
      type: EVENT_TYPES.NETWORK_ONLINE,
      source
    });
  }

  networkOffline(source?: string): void {
    this.publish({
      type: EVENT_TYPES.NETWORK_OFFLINE,
      source
    });
  }

  // UI - Toasts
  showToastSuccess(message: string, source?: string): void {
    this.publish({
      type: EVENT_TYPES.TOAST_SUCCESS,
      payload: { message },
      source
    });
  }

  showToastError(message: string, source?: string): void {
    this.publish({
      type: EVENT_TYPES.TOAST_ERROR,
      payload: { message },
      source
    });
  }

  showToastWarning(message: string, source?: string): void {
    this.publish({
      type: EVENT_TYPES.TOAST_WARNING,
      payload: { message },
      source
    });
  }

  showToastInfo(message: string, source?: string): void {
    this.publish({
      type: EVENT_TYPES.TOAST_INFO,
      payload: { message },
      source
    });
  }
}