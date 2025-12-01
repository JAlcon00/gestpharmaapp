import { Injectable, inject, Injector } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, of, fromEvent, merge, timer, from, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  LoginResponse, 
  User, 
  AuthState 
} from '../models';

// Firebase imports
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private injector = inject(Injector);

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  public authState$ = this.authStateSubject.asObservable();

  // Timer de inactividad (15 minutos = 900000 ms)
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
  private inactivityTimer: any;

  // Inyectar Firebase Auth
  private auth: Auth = inject(Auth);

  constructor() {
    this.initializeAuth();
    this.setupInactivityTimer();
    this.handleGoogleRedirect();
  }

  /**
   * Maneja el resultado de redirect de Google al inicializar el servicio
   */
  private handleGoogleRedirect(): void {
    getRedirectResult(this.auth).then((credential) => {
      if (credential && localStorage.getItem('google_login_attempt') === 'true') {
        localStorage.removeItem('google_login_attempt');
        
        const googleUser = credential.user;
        const googleAuthData = {
          email: googleUser.email!,
          nombre: googleUser.displayName || googleUser.email!.split('@')[0],
          uid: googleUser.uid,
          photoURL: googleUser.photoURL || undefined
        };

        this.apiService.post<any>('/usuarios/google-auth', googleAuthData).subscribe({
          next: (response) => {
            if (response && response.token && response.usuario) {
              this.setAuthData(response.token, response.usuario, response.refreshToken);
              this.resetInactivityTimer();
              console.log('✅ Sesión iniciada con Google (redirect):', response.usuario);
              this.router.navigate(['/tabs']);
            }
          },
          error: (error) => {
            console.error('Error autenticando con backend:', error);
          }
        });
      }
    }).catch((error) => {
      console.error('Error procesando resultado de redirect:', error);
      localStorage.removeItem('google_login_attempt');
    });
  }

  /**
   * Inicializa el estado de autenticación
   */
  private initializeAuth(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getCurrentUser();

    // Solo cargar si hay token Y usuario válidos
    if (token && user) {
      this.authStateSubject.next({
        user,
        token,
        isAuthenticated: true
      });
    } else {
      // Si falta cualquiera, limpiar todo y forzar logout
      this.forceLogout();
    }
  }

  /**
   * Configura el timer de inactividad
   */
  private setupInactivityTimer(): void {
    // Escuchar eventos de actividad del usuario
    const userActivity$ = merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'scroll')
    );

    // Resetear timer en cada actividad
    userActivity$.subscribe(() => {
      if (this.isAuthenticated()) {
        this.resetInactivityTimer();
      }
    });
  }

  /**
   * Resetea el timer de inactividad
   */
  private resetInactivityTimer(): void {
    // Limpiar timer anterior
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Crear nuevo timer
    this.inactivityTimer = setTimeout(() => {
      console.log('⏱️ Sesión cerrada por inactividad (15 minutos)');
      this.logoutDueToInactivity();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Detiene el timer de inactividad
   */
  private stopInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  /**
   * Cierra sesión por inactividad
   */
  private logoutDueToInactivity(): void {
    this.logout();
    this.router.navigate(['/login'], {
      queryParams: { reason: 'inactivity' }
    });
  }

  /**
   * Fuerza el logout y limpia todo
   */
  private forceLogout(): void {
    this.storageService.clearAuthData();
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
    this.stopInactivityTimer();
  }

  /**
   * Carga el estado de autenticación desde localStorage (DEPRECADO - usar initializeAuth)
   */
  private loadAuthState(): void {
    // Método deprecado, ahora se usa initializeAuth
    this.initializeAuth();
  }

  /**
   * Inicia sesión con email y password
   */
  login(email: string, password: string): Observable<any> {
    const loginRequest: LoginRequest = { email, password };
    
    return this.apiService.post<any>(environment.endpoints.auth, loginRequest)
      .pipe(
        tap(response => {
          // El interceptor ya extrae el 'data' del backend
          // Ahora response = { token, usuario, refreshToken, expiresIn, refreshExpiresIn }
          if (response && response.token && response.usuario) {
            this.setAuthData(
              response.token, 
              response.usuario, 
              response.refreshToken
            );
            // Iniciar timer de inactividad después del login exitoso
            this.resetInactivityTimer();
          }
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Inicia sesión con Google usando Firebase
   * Intenta con popup primero, si falla usa redirect
   */
  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Intentar con popup primero
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credential: UserCredential) => {
        return this.processGoogleCredential(credential);
      }),
      catchError(error => {
        console.error('❌ Error con popup, intentando con redirect...', error);

        // Si falla el popup, usar redirect
        if (error.code === 'auth/popup-blocked' || 
            error.code === 'auth/popup-closed-by-user' ||
            error.code === 'auth/cancelled-popup-request') {
          
          // Guardar que estamos intentando login con Google
          localStorage.setItem('google_login_attempt', 'true');
          
          // Iniciar redirect
          signInWithRedirect(this.auth, provider);
          
          // Retornar observable vacío ya que el redirect interrumpe el flujo
          return of(null);
        }

        // Para otros errores, propagar
        let errorMessage = 'Error al iniciar sesión con Google';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Ventana de inicio de sesión cerrada';
        } else if (error.error) {
          errorMessage = error.error;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Procesa las credenciales de Google y autentica en el backend
   */
  private processGoogleCredential(credential: UserCredential): Observable<any> {
    const googleUser = credential.user;
    const googleAuthData = {
      email: googleUser.email!,
      nombre: googleUser.displayName || googleUser.email!.split('@')[0],
      uid: googleUser.uid,
      photoURL: googleUser.photoURL || undefined
    };

    console.log('✅ Usuario de Google autenticado:', googleAuthData);

    return this.apiService.post<any>('/usuarios/google-auth', googleAuthData).pipe(
      tap(response => {
        if (response && response.token && response.usuario) {
          this.setAuthData(
            response.token,
            response.usuario,
            response.refreshToken
          );
          this.resetInactivityTimer();
          console.log('✅ Sesión iniciada con Google:', response.usuario);
        }
      })
    );
  }



  /**
   * Cierra sesión
   */
  logout(): void {
    this.stopInactivityTimer();
    this.storageService.clearAuthData();
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  /**
   * Guarda los datos de autenticación
   */
  private setAuthData(token: string, user: User, refreshToken?: string): void {
    this.storageService.setToken(token);
    this.storageService.setCurrentUser(user);
    
    if (refreshToken) {
      this.storageService.setRefreshToken(refreshToken);
    }

    this.authStateSubject.next({
      user,
      token,
      isAuthenticated: true
    });
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.storageService.getToken();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(roleId: number): boolean {
    const user = this.getCurrentUser();
    return user ? user.rolId === roleId : false;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roleIds: number[]): boolean {
    const user = this.getCurrentUser();
    return user ? roleIds.includes(user.rolId) : false;
  }

  /**
   * Obtiene el perfil del usuario desde el servidor
   */
  getProfile(): Observable<User> {
    return this.apiService.get<User>(environment.endpoints.profile)
      .pipe(
        tap(user => {
          this.storageService.setCurrentUser(user);
          const currentState = this.authStateSubject.value;
          this.authStateSubject.next({
            ...currentState,
            user
          });
        })
      );
  }

  /**
   * Refresca el token de autenticación
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<LoginResponse>(environment.endpoints.refreshToken, { refreshToken })
      .pipe(
        tap(response => {
          this.setAuthData(response.token, response.user, response.refreshToken);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Verifica si el token está por expirar (último 10% de su vida)
   */
  isTokenExpiringSoon(): boolean {
    // TODO: Implementar lógica para verificar expiración del token JWT
    // Decodificar el token y verificar el campo 'exp'
    return false;
  }
}
