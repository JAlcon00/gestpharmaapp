export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
  codigoBarras?: string;
  lote?: string;
  fechaVencimiento?: string;
  stockMinimo?: number;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  categoria?: Category;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ProductCreateRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
  codigoBarras?: string;
  lote?: string;
  fechaVencimiento?: string;
  stockMinimo?: number;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  activo?: boolean;
}
