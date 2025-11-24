import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener los roles permitidos de la configuración de la ruta
  const allowedRoles = route.data['roles'] as number[];

  if (!allowedRoles || allowedRoles.length === 0) {
    // Si no se especificaron roles, permitir acceso
    return true;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  if (authService.hasAnyRole(allowedRoles)) {
    return true;
  }

  // Si no tiene el rol adecuado, redirigir a página de no autorizado o home
  router.navigate(['/unauthorized']);
  return false;
};
