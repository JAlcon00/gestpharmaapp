import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CartStore, CartItem } from '../core/stores';
import { Product } from '../core/models';

// Re-export para compatibilidad
export { CartItem };

/**
 * CartService - Fachada para el CartStore
 *
 * Este servicio mantiene compatibilidad con el código existente
 * mientras delega la lógica de estado al CartStore (NgRx-lite pattern).
 *
 * DEPRECATED: Considera usar CartStore directamente en nuevos componentes.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartStore = inject(CartStore);


  /**
   * Observable de items del carrito
   */
  get cartItems$(): Observable<CartItem[]> {
    return this.cartStore.items$;
  }

  /**
   * Obtiene los items del carrito (síncrono)
   */
  getItems(): CartItem[] {
    return this.cartStore.getCurrentItems();
  }

  /**
   * Agrega un producto al carrito
   */
  addItem(product: Product, quantity: number = 1): void {
    this.cartStore.addItem(product, quantity);
  }

  /**
   * Actualiza la cantidad de un item
   */
  updateQuantity(productId: number, quantity: number): void {
    this.cartStore.updateQuantity(productId, quantity);
  }

  /**
   * Remueve un item del carrito
   */
  removeItem(productId: number): void {
    this.cartStore.removeItem(productId);
  }

  /**
   * Limpia el carrito
   */
  clear(): void {
    this.cartStore.clear();
  }

  /**
   * Obtiene el total del carrito (síncrono)
   */
  getTotal(): number {
    // Para compatibilidad, calculamos del estado actual
    return this.getItems().reduce((total, item) => total + item.subtotal, 0);
  }

  /**
   * Obtiene la cantidad total de items (síncrono)
   */
  getItemCount(): number {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Verifica si el carrito está vacío
   */
  isEmpty(): boolean {
    return this.getItems().length === 0;
  }

  /**
   * Observable del total del carrito
   */
  get total$(): Observable<number> {
    return this.cartStore.total$;
  }

  /**
   * Observable del conteo de items
   */
  get itemCount$(): Observable<number> {
    return this.cartStore.itemCount$;
  }

  /**
   * Observable del estado vacío
   */
  get isEmpty$(): Observable<boolean> {
    return this.cartStore.isEmpty$;
  }
}
