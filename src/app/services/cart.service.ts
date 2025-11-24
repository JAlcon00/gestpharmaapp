import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../core/models';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Carga el carrito desde localStorage
   */
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error cargando carrito:', error);
      }
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  /**
   * Obtiene los items del carrito
   */
  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Agrega un producto al carrito
   */
  addItem(product: Product, quantity: number = 1): void {
    console.log('🛒 CartService.addItem - Product:', {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      quantity
    });
    
    const currentItems = this.getItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      // Si el producto ya existe, incrementar cantidad
      currentItems[existingItemIndex].quantity += quantity;
      currentItems[existingItemIndex].subtotal = 
        currentItems[existingItemIndex].quantity * currentItems[existingItemIndex].product.precio;
      console.log('✏️ Updated existing item:', currentItems[existingItemIndex]);
    } else {
      // Si es nuevo, agregarlo
      const newItem = {
        product,
        quantity,
        subtotal: product.precio * quantity
      };
      console.log('➕ Adding new item:', newItem);
      currentItems.push(newItem);
    }

    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
    console.log('💾 Cart saved. Total items:', currentItems.length);
  }

  /**
   * Actualiza la cantidad de un item
   */
  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.getItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        currentItems[itemIndex].quantity = quantity;
        currentItems[itemIndex].subtotal = quantity * currentItems[itemIndex].product.precio;
        this.cartItemsSubject.next(currentItems);
        this.saveCartToStorage();
      }
    }
  }

  /**
   * Remueve un item del carrito
   */
  removeItem(productId: number): void {
    const currentItems = this.getItems().filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  /**
   * Limpia el carrito
   */
  clear(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  /**
   * Obtiene el total del carrito
   */
  getTotal(): number {
    return this.getItems().reduce((total, item) => total + item.subtotal, 0);
  }

  /**
   * Obtiene la cantidad total de items
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
}
