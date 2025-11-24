import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import { 
  DashboardReport,
  DashboardResponse,
  SalesReport, 
  InventoryReport, 
  PurchaseReport, 
  TopClientsReport,
  ProductSales 
} from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly endpoint = environment.endpoints.reportes;

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene el dashboard general con KPIs
   */
  getDashboard(): Observable<DashboardReport> {
    return this.apiService.get<DashboardResponse | DashboardReport>(this.endpoint).pipe(
      map(data => {
        // Si viene con estructura DashboardResponse (con estadisticas)
        if ('estadisticas' in data) {
          const stats = data.estadisticas;
          // Mapear los nombres del backend a los del frontend
          return {
            totalVentasHoy: (stats as any).montoTotalVentas || 0,
            totalVentasSemana: (stats as any).montoTotalVentas || 0,
            totalVentasMes: (stats as any).montoTotalVentas || 0,
            totalProductos: (stats as any).totalProductos || stats.totalProductos || 0,
            productosStockBajo: (stats as any).totalProductos || stats.productosStockBajo || 0,
            totalClientes: (stats as any).totalClientes || stats.totalClientes || 0,
            totalProveedores: (stats as any).totalProveedores || stats.totalProveedores || 0
          } as DashboardReport;
        }
        // Si viene directamente como DashboardReport
        return data;
      })
    );
  }

  /**
   * Obtiene el reporte de ventas
   */
  getSalesReport(params?: { fechaInicio?: string; fechaFin?: string }): Observable<SalesReport> {
    return this.apiService.get<any>(environment.endpoints.reportesVentas, params).pipe(
      map(response => {
        console.log('🔍 Respuesta raw de ventas:', response);
        
        // Si viene envuelto en {ventas: [...]}
        const ventas = response.ventas || [];
        
        // Calcular estadísticas
        const totalVentas = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const numeroVentas = ventas.length;
        const ventaPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
        
        return {
          fechaInicio: params?.fechaInicio || '',
          fechaFin: params?.fechaFin || '',
          totalVentas,
          numeroVentas,
          ventaPromedio,
          ventas: ventas.map((v: any) => ({
            id: v.id,
            total: v.total || 0,
            fechaVenta: v.fechaVenta || v.fecha,
            cliente: v.clienteNombre || v.cliente
          }))
        } as SalesReport;
      })
    );
  }

  /**
   * Obtiene el reporte de compras
   */
  getPurchasesReport(params?: { fechaInicio?: string; fechaFin?: string }): Observable<PurchaseReport> {
    return this.apiService.get<PurchaseReport>(environment.endpoints.reportesCompras, params);
  }

  /**
   * Obtiene el reporte de inventario
   */
  getInventoryReport(): Observable<InventoryReport> {
    return this.apiService.get<any>(environment.endpoints.reportesInventario).pipe(
      map(response => {
        console.log('🔍 Respuesta raw de inventario:', response);
        
        const productos = response.productos || [];
        const estadisticas = response.estadisticas || {};
        
        // Calcular valor total del inventario
        const valorTotalInventario = productos.reduce((sum: number, p: any) => 
          sum + ((p.precio || 0) * (p.stock || 0)), 0
        );
        
        // Filtrar productos con stock bajo (stock <= stockMinimo o stock < 10)
        const productosStockBajo = productos
          .filter((p: any) => (p.stock || 0) <= (p.stockMinimo || 10))
          .map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            stock: p.stock || 0,
            stockMinimo: p.stockMinimo || 10,
            categoria: p.categoriaNombre || p.categoria || 'Sin categoría'
          }));
        
        return {
          totalProductos: estadisticas.totalProductos || productos.length,
          valorTotalInventario,
          productosStockBajo,
          productosPorCategoria: []
        } as InventoryReport;
      })
    );
  }

  /**
   * Obtiene los productos más vendidos
   */
  getTopProducts(params?: { limit?: number; fechaInicio?: string; fechaFin?: string }): Observable<ProductSales[]> {
    return this.apiService.get<any>(environment.endpoints.reportesProductosMasVendidos, params).pipe(
      map(response => {
        console.log('🔍 Respuesta raw de top productos:', response);
        
        // Si viene envuelto en {productos: [...]}
        const productos = response.productos || [];
        
        // Mapear productos a ProductSales
        return productos.map((p: any) => ({
          productoId: p.productoId || p.id || 0,
          nombreProducto: p.nombreProducto || p.nombre || 'Sin nombre',
          cantidadVendida: p.cantidadVendida || 0,
          totalVentas: p.totalVentas || 0
        }));
      })
    );
  }

  /**
   * Obtiene los clientes top
   */
  getTopClients(params?: { limit?: number; fechaInicio?: string; fechaFin?: string }): Observable<TopClientsReport> {
    return this.apiService.get<TopClientsReport>(environment.endpoints.reportesClientesTop, params);
  }
}
