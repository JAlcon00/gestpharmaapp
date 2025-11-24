import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Interceptor que normaliza las respuestas del backend
 * Algunos endpoints devuelven objetos/arrays directamente
 * Otros devuelven {success: true, data: {...}}
 * Este interceptor extrae el 'data' cuando existe
 */
export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.body) {
        const body = event.body as any;
        // Si la respuesta tiene el formato {success: true, data: {...}}
        if (body.hasOwnProperty('success') && body.hasOwnProperty('data')) {
          // Extraer solo el 'data' y reemplazar el body
          const modifiedEvent = event.clone({ body: body.data });
          Object.assign(event, modifiedEvent);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Si el error tiene el formato {success: false, error: "..."}
      if (error.error && typeof error.error === 'object') {
        const errorBody = error.error as any;
        if (errorBody.hasOwnProperty('error')) {
          const errorMessage = errorBody.error || errorBody.message || 'Error desconocido';
          return throwError(() => new Error(errorMessage));
        }
      }
      return throwError(() => error);
    })
  );
};
