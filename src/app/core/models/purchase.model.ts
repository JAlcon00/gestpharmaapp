export interface Purchase {
  id: number;
  proveedorId: number;
  usuarioId: number;
  total: number;
  estado: PurchaseStatus;
  fechaCompra: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  proveedor?: Supplier;
  usuario?: any;
  detalles?: PurchaseDetail[];
}

export interface PurchaseDetail {
  id: number;
  compraId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: any;
}

export interface Supplier {
  id: number;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface PurchaseCreateRequest {
  proveedorId: number;
  detalles: PurchaseDetailRequest[];
  observaciones?: string;
}

export interface PurchaseDetailRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export enum PurchaseStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}
