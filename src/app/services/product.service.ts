import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import { Product, Category, ProductCreateRequest, ProductUpdateRequest, PagedResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = environment.endpoints.productos;

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los productos
   * Nota: El backend puede devolver array directo o PagedResponse
   */
  getAll(params?: { page?: number; size?: number; sort?: string }): Observable<PagedResponse<Product> | Product[]> {
    return this.apiService.get<PagedResponse<Product> | Product[]>(this.endpoint, params);
  }

  /**
   * Obtiene un producto por ID
   */
  getById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo producto
   */
  create(product: ProductCreateRequest): Observable<Product> {
    return this.apiService.post<Product>(this.endpoint, product);
  }

  /**
   * Actualiza un producto existente
   */
  update(id: number, product: ProductUpdateRequest): Observable<Product> {
    return this.apiService.put<Product>(`${this.endpoint}/${id}`, product);
  }

  /**
   * Elimina un producto
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene productos por categoría
   * Nota: El backend puede devolver array directo o PagedResponse
   */
  getByCategory(categoryId: number, params?: { page?: number; size?: number }): Observable<PagedResponse<Product> | Product[]> {
    return this.apiService.get<PagedResponse<Product> | Product[]>(`${this.endpoint}?categoria=${categoryId}`, params);
  }

  /**
   * Obtiene productos con stock bajo
   * Nota: El backend puede devolver array directo o PagedResponse
   */
  getLowStock(params?: { page?: number; size?: number }): Observable<PagedResponse<Product> | Product[]> {
    return this.apiService.get<PagedResponse<Product> | Product[]>(`${this.endpoint}?stock=bajo`, params);
  }

  /**
   * Busca productos por nombre
   * Nota: El backend puede devolver array directo o PagedResponse
   */
  search(query: string, params?: { page?: number; size?: number }): Observable<PagedResponse<Product> | Product[]> {
    return this.apiService.get<PagedResponse<Product> | Product[]>(this.endpoint, { ...params, q: query });
  }
}
