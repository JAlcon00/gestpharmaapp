import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() {}

  /**
   * Guarda un valor en localStorage
   */
  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error leyendo de localStorage:', error);
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  /**
   * Verifica si existe una clave en localStorage
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Métodos específicos para auth
  getToken(): string | null {
    return this.getItem<string>('auth_token');
  }

  setToken(token: string): void {
    this.setItem('auth_token', token);
  }

  removeToken(): void {
    this.removeItem('auth_token');
  }

  getRefreshToken(): string | null {
    return this.getItem<string>('refresh_token');
  }

  setRefreshToken(token: string): void {
    this.setItem('refresh_token', token);
  }

  removeRefreshToken(): void {
    this.removeItem('refresh_token');
  }

  getCurrentUser(): any {
    return this.getItem('current_user');
  }

  setCurrentUser(user: any): void {
    this.setItem('current_user', user);
  }

  removeCurrentUser(): void {
    this.removeItem('current_user');
  }

  clearAuthData(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeCurrentUser();
  }
}
