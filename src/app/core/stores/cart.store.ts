import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import { Product } from '../models';

/**
 * INTERFACES DE ESTADO
 */

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

/**
 * ACCIONES (Actions)
 */

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: { items: CartItem[] } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } };

/**
 * ESTADO INICIAL
 */

const initialState: CartState = {
  items: [],
  loading: false,
  error: null
};

/**
 * REDUCER
 */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);

      let newItems: CartItem[];

      if (existingItemIndex !== -1) {
        // Actualizar cantidad de item existente
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.product.precio
              }
            : item
        );
      } else {
        // Agregar nuevo item
        newItems = [
          ...state.items,
          {
            product,
            quantity,
            subtotal: product.precio * quantity
          }
        ];
      }

      return {
        ...state,
        items: newItems,
        error: null
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Si cantidad es 0 o negativa, remover item
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== productId),
          error: null
        };
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.precio
            }
          : item
      );

      return {
        ...state,
        items: newItems,
        error: null
      };
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
        error: null
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        error: null
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        items: action.payload.items,
        loading: false,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };

    default:
      return state;
  }
}

/**
 * CART STORE (NgRx-lite pattern)
 */

@Injectable({
  providedIn: 'root'
})
export class CartStore {

  private _state$ = new BehaviorSubject<CartState>(initialState);
  private dispatch = (action: CartAction) => {
    const currentState = this._state$.value;
    const newState = cartReducer(currentState, action);
    this._state$.next(newState);

    // Persistir cambios automáticamente
    this.persistState(newState);
  };

  constructor() {
    this.loadFromStorage();
  }

  /**
   * SELECTORES (Selectors)
   */

  // Estado completo
  get state$(): Observable<CartState> {
    return this._state$.asObservable();
  }

  // Items del carrito
  get items$(): Observable<CartItem[]> {
    return this._state$.pipe(
      map(state => state.items),
      distinctUntilChanged()
    );
  }

  // Total del carrito
  get total$(): Observable<number> {
    return this._state$.pipe(
      map(state => state.items.reduce((total, item) => total + item.subtotal, 0)),
      distinctUntilChanged()
    );
  }

  // Cantidad total de items
  get itemCount$(): Observable<number> {
    return this._state$.pipe(
      map(state => state.items.reduce((count, item) => count + item.quantity, 0)),
      distinctUntilChanged()
    );
  }

  // Estado vacío
  get isEmpty$(): Observable<boolean> {
    return this._state$.pipe(
      map(state => state.items.length === 0),
      distinctUntilChanged()
    );
  }

  // Estado de carga
  get loading$(): Observable<boolean> {
    return this._state$.pipe(
      map(state => state.loading),
      distinctUntilChanged()
    );
  }

  // Error actual
  get error$(): Observable<string | null> {
    return this._state$.pipe(
      map(state => state.error),
      distinctUntilChanged()
    );
  }

  /**
   * ACCIONES PÚBLICAS (Public Actions)
   */

  addItem(product: Product, quantity: number = 1): void {
    this.dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity }
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  }

  removeItem(productId: number): void {
    this.dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId }
    });
  }

  clear(): void {
    this.dispatch({ type: 'CLEAR_CART' });
  }

  /**
   * MÉTODOS DE PERSISTENCIA
   */

  private persistState(state: CartState): void {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved);
        this.dispatch({
          type: 'LOAD_FROM_STORAGE',
          payload: { items }
        });
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  /**
   * MÉTODOS DE DEBUGGING
   */

  // Obtener estado actual (solo para debugging)
  getCurrentState(): CartState {
    return this._state$.value;
  }

  // Obtener items actuales (solo para debugging)
  getCurrentItems(): CartItem[] {
    return this._state$.value.items;
  }
}