import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import { Sale, SaleDetail, SaleCreateRequest, PagedResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiService = inject(ApiService);

  private readonly endpoint = environment.endpoints.ventas;

  /**
   * Obtiene todas las ventas
   */
  getAll(params?: { 
    page?: number; 
    size?: number; 
    fechaInicio?: string; 
    fechaFin?: string;
    estado?: string;
  }): Observable<PagedResponse<Sale>> {
    return this.apiService.get<PagedResponse<Sale>>(this.endpoint, params);
  }

  /**
   * Obtiene una venta por ID
   */
  getById(id: number): Observable<Sale> {
    return this.apiService.get<Sale>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva venta
   */
  create(sale: SaleCreateRequest): Observable<Sale> {
    return this.apiService.post<Sale>(this.endpoint, sale);
  }

  /**
   * Obtiene los detalles de una venta
   */
  getDetails(id: number): Observable<SaleDetail[]> {
    const detailsEndpoint = environment.endpoints.ventasDetalles.replace('{id}', id.toString());
    return this.apiService.get<SaleDetail[]>(detailsEndpoint);
  }

  /**
   * Cancela una venta
   */
  cancel(id: number): Observable<Sale> {
    return this.apiService.patch<Sale>(`${this.endpoint}/${id}/cancelar`, {});
  }

  /**
   * Obtiene las ventas de hoy
   */
  getToday(): Observable<Sale[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.apiService.get<Sale[]>(this.endpoint, { fechaInicio: today, fechaFin: today });
  }
}
