export interface Sale {
  id: number;
  clienteId?: number;
  usuarioId: number;
  total: number;
  estado: SaleStatus;
  fechaVenta: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  cliente?: ClientSimple;
  usuario?: any;
  detalles?: SaleDetail[];
}

export interface SaleDetail {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: any;
}

// Client interface moved to client.model.ts
export interface ClientSimple {
  id: number;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface SaleCreateRequest {
  clienteId?: number;
  detalles: SaleDetailRequest[];
  observaciones?: string;
}

export interface SaleDetailRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export enum SaleStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}
