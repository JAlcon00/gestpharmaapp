import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

/**
 * INTERFAZ PARA CACHE ENTRY
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * CACHE SERVICE CON MEMOIZACIÓN
 *
 * Implementa caching inteligente con TTL y memoización automática
 * para optimizar performance y reducir llamadas a API.
 *
 * @example
 * ```typescript
 * // Cache automático con TTL
 * this.cacheService.get('products', () => this.api.getProducts(), 5 * 60 * 1000)
 *   .subscribe(products => console.log(products));
 *
 * // Memoización de funciones
 * const memoizedFn = this.cacheService.memoize('expensive-calc', expensiveCalculation);
 * const result1 = memoizedFn(param1);
 * const result2 = memoizedFn(param1); // Retorna cache
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, CacheEntry<any>>();
  private memoizedFunctions = new Map<string, Map<string, any>>();

  /**
   * Obtiene datos con cache automático
   *
   * @param key - Clave única para el cache
   * @param fetchFn - Función que obtiene los datos
   * @param ttl - Time To Live en milisegundos (default: 5 minutos)
   * @param forceRefresh - Forzar refresh ignorando cache
   *
   * @returns Observable con los datos
   */
  get<T>(
    key: string,
    fetchFn: () => Observable<T>,
    ttl: number = 5 * 60 * 1000,
    forceRefresh: boolean = false
  ): Observable<T> {
    // Verificar si hay cache válido
    if (!forceRefresh) {
      const cached = this.getFromCache<T>(key);
      if (cached) {
        console.log(`[CacheService] Using cached data for ${key}`);
        return of(cached);
      }
    }

    // Obtener datos frescos y cachear
    return fetchFn().pipe(
      tap(data => {
        this.setCache(key, data, ttl);
        console.log(`[CacheService] Cached data for ${key}`);
      }),
      shareReplay(1) // Compartir resultado entre múltiples suscriptores
    );
  }

  /**
   * Invalida una entrada específica del cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[CacheService] Invalidated cache for ${key}`);
  }

  /**
   * Invalida todas las entradas del cache que coinciden con un patrón
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`[CacheService] Invalidated cache for ${key}`);
    });
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
    this.memoizedFunctions.clear();
    console.log('[CacheService] Cache cleared');
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): { entries: number; size: string } {
    const entries = this.cache.size;
    let totalSize = 0;

    for (const entry of this.cache.values()) {
      totalSize += this.estimateSize(entry);
    }

    return {
      entries,
      size: this.formatBytes(totalSize)
    };
  }

  /**
   * Memoiza una función pura
   *
   * @param key - Clave base para el memo
   * @param fn - Función a memoizar
   * @param getKey - Función para generar clave de cache (opcional)
   *
   * @returns Función memoizada
   */
  memoize<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    getKey?: (...args: Parameters<T>) => string
  ): T {
    if (!this.memoizedFunctions.has(key)) {
      this.memoizedFunctions.set(key, new Map());
    }

    const cache = this.memoizedFunctions.get(key)!;

    return ((...args: Parameters<T>) => {
      const cacheKey = getKey ? getKey(...args) : JSON.stringify(args);

      if (cache.has(cacheKey)) {
        console.log(`[CacheService] Using memoized result for ${key}:${cacheKey}`);
        return cache.get(cacheKey);
      }

      const result = fn(...args);
      cache.set(cacheKey, result);

      console.log(`[CacheService] Memoized result for ${key}:${cacheKey}`);
      return result;
    }) as T;
  }

  /**
   * Configura limpieza automática del cache expirado
   */
  startCleanupInterval(intervalMs: number = 60 * 1000): void {
    timer(0, intervalMs).subscribe(() => {
      this.cleanupExpired();
    });
  }

  /**
   * Limpia entradas expiradas del cache
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`[CacheService] Cleaned expired cache for ${key}`);
    });
  }

  /**
   * Obtiene datos del cache si son válidos
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Guarda datos en el cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Estima el tamaño de un objeto en bytes (aproximado)
   */
  private estimateSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str ? str.length * 2 : 0; // UTF-16 = 2 bytes por caracter
  }

  /**
   * Formatea bytes a string legible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}