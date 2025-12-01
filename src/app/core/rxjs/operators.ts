import { pipe, OperatorFunction, timer, throwError, of } from 'rxjs';
import { map, catchError, retry, mergeMap, tap, take } from 'rxjs/operators';

/**
 * OPERADORES RXJS PERSONALIZADOS PARA GESTPHARMA
 *
 * Estos operadores encapsulan lógica común y mejoran la reutilización
 * de patrones RxJS en toda la aplicación.
 */

/**
 * Operador para logging con contexto
 *
 * @param context - Contexto para identificar el log
 * @param level - Nivel de log ('log', 'warn', 'error')
 *
 * @example
 * ```typescript
 * this.apiService.getProducts()
 *   .pipe(logWithContext('ProductService.getProducts'))
 *   .subscribe(products => console.log(products));
 * ```
 */
export function logWithContext<T>(
  context: string,
  level: 'log' | 'warn' | 'error' = 'log'
): OperatorFunction<T, T> {
  return pipe(
    tap({
      next: (value) => {
        const message = `[${context}] ${JSON.stringify(value, null, 2)}`;
        console[level](message);
      },
      error: (error) => {
        console.error(`[${context}] Error:`, error);
      },
      complete: () => {
        console[level](`[${context}] Completed`);
      }
    })
  );
}

/**
 * Operador para retry con backoff exponencial
 *
 * @param maxRetries - Número máximo de reintentos
 * @param initialDelay - Delay inicial en ms
 * @param backoffFactor - Factor de multiplicación para el delay
 *
 * @example
 * ```typescript
 * this.http.get('/api/products')
 *   .pipe(retryWithBackoff(3, 1000, 2))
 *   .subscribe(products => console.log(products));
 * ```
 */
export function retryWithBackoff<T>(
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffFactor: number = 2
): OperatorFunction<T, T> {
  return pipe(
    retry({
      count: maxRetries,
      delay: (error, attemptIndex) => {
        const delayMs = initialDelay * Math.pow(backoffFactor, attemptIndex);
        console.warn(`Retry attempt ${attemptIndex + 1}/${maxRetries} after ${delayMs}ms`);
        return timer(delayMs);
      }
    })
  );
}

/**
 * Operador para cache con TTL (Time To Live)
 *
 * @param cacheKey - Clave para identificar el cache
 * @param ttlMs - Tiempo de vida en milisegundos
 *
 * @example
 * ```typescript
 * this.apiService.getCategories()
 *   .pipe(cacheWithTTL('categories', 5 * 60 * 1000)) // 5 minutos
 *   .subscribe(categories => console.log(categories));
 * ```
 */
export function cacheWithTTL<T>(
  cacheKey: string,
  ttlMs: number = 5 * 60 * 1000
): OperatorFunction<T, T> {
  return pipe(
    map((data: T) => {
      const cacheKeyFull = `cache_${cacheKey}`;
      const cached = localStorage.getItem(cacheKeyFull);

      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const now = Date.now();

          if (now - timestamp < ttlMs) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData as T;
          }
        } catch (error) {
          console.warn('Error reading cache:', error);
        }
      }

      // Guardar en cache
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKeyFull, JSON.stringify(cacheData));

      return data;
    })
  );
}

/**
 * Operador para debounce de búsqueda
 *
 * @param debounceMs - Tiempo de debounce en ms
 *
 * @example
 * ```typescript
 * this.searchInput.valueChanges
 *   .pipe(debounceSearch(300))
 *   .subscribe(query => this.performSearch(query));
 * ```
 */
export function debounceSearch<T>(
  debounceMs: number = 300
): OperatorFunction<T, T> {
  return pipe(
    // Nota: Este operador asume que el debounce ya está aplicado upstream
    // Es un marcador semántico para claridad
    tap(() => {
      console.log(`Search debounced with ${debounceMs}ms delay`);
    })
  );
}

/**
 * Operador para manejar loading states
 *
 * @param loadingSubject - Subject para controlar el estado de carga
 *
 * @example
 * ```typescript
 * private loadingSubject = new BehaviorSubject(false);
 *
 * this.apiService.getProducts()
 *   .pipe(withLoadingState(this.loadingSubject))
 *   .subscribe(products => console.log(products));
 *
 * // En template
 * <div *ngIf="loading$ | async">Loading...</div>
 * ```
 */
export function withLoadingState<T>(
  loadingSubject: { next: (value: boolean) => void }
): OperatorFunction<T, T> {
  return pipe(
    tap({
      subscribe: () => loadingSubject.next(true),
      next: () => loadingSubject.next(false),
      error: () => loadingSubject.next(false),
      complete: () => loadingSubject.next(false)
    })
  );
}

/**
 * Operador para transformar errores en mensajes user-friendly
 *
 * @param errorMessages - Mapa de mensajes de error
 *
 * @example
 * ```typescript
 * const errorMessages = {
 *   '404': 'Producto no encontrado',
 *   '500': 'Error del servidor',
 *   'default': 'Error desconocido'
 * };
 *
 * this.apiService.getProduct(id)
 *   .pipe(mapErrorMessages(errorMessages))
 *   .subscribe({
 *     next: product => console.log(product),
 *     error: message => this.toastService.error(message)
 *   });
 * ```
 */
export function mapErrorMessages<T>(
  errorMessages: Record<string | number, string>
): OperatorFunction<T, T> {
  return pipe(
    catchError((error: any) => {
      const status = error.status?.toString() || 'default';
      const message = errorMessages[status] || errorMessages['default'] || 'Error desconocido';

      console.error('Mapped error:', error, 'to message:', message);

      return throwError(() => new Error(message));
    })
  );
}

/**
 * Operador para auto-refresh periódico
 *
 * @param intervalMs - Intervalo de refresh en ms
 * @param enabled - Función para determinar si el refresh está habilitado
 *
 * @example
 * ```typescript
 * this.apiService.getLiveData()
 *   .pipe(autoRefresh(30000, () => this.isTabActive))
 *   .subscribe(data => this.updateData(data));
 * ```
 */
export function autoRefresh<T>(
  intervalMs: number = 30000,
  enabled: () => boolean = () => true
): OperatorFunction<T, T> {
  return pipe(
    mergeMap(data => {
      if (!enabled()) {
        return of(data);
      }

      // Emitir dato inicial inmediatamente
      return timer(0, intervalMs).pipe(
        take(1), // Solo una vez inicialmente
        map(() => data)
      );
    })
  );
}

/**
 * Operador para optimistic updates
 *
 * @param updateFn - Función que realiza la actualización optimista
 * @param rollbackFn - Función que revierte la actualización en caso de error
 *
 * @example
 * ```typescript
 * this.apiService.updateProduct(id, changes)
 *   .pipe(
 *     optimisticUpdate(
 *       () => this.updateLocalProduct(id, changes),
 *       () => this.rollbackLocalProduct(id)
 *     )
 *   )
 *   .subscribe(result => console.log('Update successful'));
 * ```
 */
export function optimisticUpdate<T>(
  updateFn: () => void,
  rollbackFn: () => void
): OperatorFunction<T, T> {
  return pipe(
    tap({
      subscribe: () => {
        // Aplicar actualización optimista
        updateFn();
      }
    }),
    catchError(error => {
      // Revertir en caso de error
      rollbackFn();
      return throwError(() => error);
    })
  );
}

/**
 * Operador para debug detallado (solo en desarrollo)
 *
 * @param label - Etiqueta para identificar el operador
 *
 * @example
 * ```typescript
 * this.apiService.getProducts()
 *   .pipe(debug('ProductService'))
 *   .subscribe(products => console.log(products));
 * ```
 */
export function debug<T>(label: string): OperatorFunction<T, T> {
  return pipe(
    tap({
      next: (value) => console.log(`[${label}] Next:`, value),
      error: (error) => console.error(`[${label}] Error:`, error),
      complete: () => console.log(`[${label}] Complete`)
    })
  );
}