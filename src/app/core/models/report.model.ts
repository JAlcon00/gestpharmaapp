export interface DashboardReport {
  totalVentasHoy: number;
  totalVentasSemana: number;
  totalVentasMes: number;
  totalProductos: number;
  productosStockBajo: number;
  totalClientes: number;
  totalProveedores: number;
  ventasRecientes?: RecentSale[];
  productosTop?: ProductSales[];
}

export interface DashboardResponse {
  descripcion: string;
  estadisticas: DashboardReport;
  estado: string;
  sistema: string;
  fechaGeneracion: string;
}

export interface RecentSale {
  id: number;
  total: number;
  fechaVenta: string;
  cliente?: string;
}

export interface ProductSales {
  productoId: number;
  nombreProducto: string;
  cantidadVendida: number;
  totalVentas: number;
}

export interface SalesReport {
  fechaInicio: string;
  fechaFin: string;
  totalVentas: number;
  numeroVentas: number;
  ventaPromedio: number;
  ventas: RecentSale[];
}

export interface InventoryReport {
  totalProductos: number;
  valorTotalInventario: number;
  productosStockBajo: ProductStock[];
  productosPorCategoria: CategoryInventory[];
}

export interface ProductStock {
  id: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
  categoria: string;
}

export interface CategoryInventory {
  categoriaId: number;
  nombreCategoria: string;
  cantidadProductos: number;
  valorTotal: number;
}

export interface PurchaseReport {
  fechaInicio: string;
  fechaFin: string;
  totalCompras: number;
  numeroCompras: number;
  compraPromedio: number;
  compras: any[];
}

export interface TopClientsReport {
  clientes: ClientSales[];
}

export interface ClientSales {
  clienteId: number;
  nombreCliente: string;
  totalCompras: number;
  montoTotal: number;
}
