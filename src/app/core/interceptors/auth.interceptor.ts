import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();

  // Si hay token y la petición es a nuestra API, agregar el header de autorización
  if (token && req.url.includes(environment.apiUrl)) {
    const clonedRequest = req.clone({
      setHeaders: {
        [environment.jwt.headerName]: `${environment.jwt.tokenPrefix}${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
