import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import { Client, ClientCreateRequest, ClientUpdateRequest } from '../core/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly endpoint = environment.endpoints.clientes;

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los clientes
   */
  getAll(): Observable<Client[]> {
    return this.apiService.get<Client[]>(this.endpoint);
  }

  /**
   * Busca clientes por nombre, email o teléfono
   */
  search(query: string): Observable<Client[]> {
    return this.apiService.get<Client[]>(`${this.endpoint}?search=${encodeURIComponent(query)}`);
  }

  /**
   * Obtiene un cliente por ID
   */
  getById(id: number): Observable<Client> {
    return this.apiService.get<Client>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo cliente
   */
  create(client: ClientCreateRequest): Observable<Client> {
    return this.apiService.post<Client>(this.endpoint, client);
  }

  /**
   * Actualiza un cliente existente
   */
  update(id: number, client: ClientUpdateRequest): Observable<Client> {
    return this.apiService.put<Client>(`${this.endpoint}/${id}`, client);
  }

  /**
   * Elimina un cliente
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
