export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rfc?: string;
  activo: boolean;
  fechaRegistro?: string;
  ultimaCompra?: string;
  totalCompras?: number;
}

export interface ClientCreateRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  rfc?: string;
}

export interface ClientUpdateRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rfc?: string;
  activo?: boolean;
}
