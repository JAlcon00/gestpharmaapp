import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import { Category, PagedResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiService = inject(ApiService);

  private readonly endpoint = environment.endpoints.categorias;

  /**
   * Obtiene todas las categorías
   * Nota: El backend puede devolver array directo o PagedResponse
   */
  getAll(params?: { page?: number; size?: number }): Observable<PagedResponse<Category> | Category[]> {
    return this.apiService.get<PagedResponse<Category> | Category[]>(this.endpoint, params);
  }

  /**
   * Obtiene una categoría por ID
   */
  getById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  create(category: Partial<Category>): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, category);
  }

  /**
   * Actualiza una categoría existente
   */
  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${id}`, category);
  }

  /**
   * Elimina una categoría
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
