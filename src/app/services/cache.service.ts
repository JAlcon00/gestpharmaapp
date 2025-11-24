import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutos

  // Observables para productos y categorías (para notificar cambios en tiempo real)
  private productsSubject = new BehaviorSubject<any[]>([]);
  public products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<any[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  /**
   * Guarda datos en cache con tiempo de expiración
   */
  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRATION): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
    this.cache.set(key, entry);

    // Si es lista de productos o categorías, actualizar observables
    if (key === 'products') {
      this.productsSubject.next(data as any);
    } else if (key === 'categories') {
      this.categoriesSubject.next(data as any);
    }
  }

  /**
   * Obtiene datos del cache si aún son válidos
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = (now - entry.timestamp) > entry.expiresIn;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Verifica si existe un valor válido en cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Elimina una entrada específica del cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
    this.productsSubject.next([]);
    this.categoriesSubject.next([]);
  }

  /**
   * Invalida cache relacionado con productos
   */
  invalidateProducts(): void {
    this.delete('products');
    this.delete('products_page_*');
  }

  /**
   * Invalida cache relacionado con categorías
   */
  invalidateCategories(): void {
    this.delete('categories');
  }

  /**
   * Obtiene productos desde el cache observable
   */
  getProducts(): any[] {
    return this.productsSubject.value;
  }

  /**
   * Actualiza productos en cache y notifica a suscriptores
   */
  updateProducts(products: any[]): void {
    this.set('products', products);
  }

  /**
   * Obtiene categorías desde el cache observable
   */
  getCategories(): any[] {
    return this.categoriesSubject.value;
  }

  /**
   * Actualiza categorías en cache y notifica a suscriptores
   */
  updateCategories(categories: any[]): void {
    this.set('categories', categories);
  }
}
