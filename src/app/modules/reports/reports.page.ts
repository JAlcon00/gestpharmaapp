import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonChip,
  IonIcon,
  IonButton,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trendingUpOutline,
  trendingDownOutline,
  cubeOutline,
  cartOutline,
  alertCircleOutline,
  downloadOutline,
  refreshOutline,
  barChartOutline
} from 'ionicons/icons';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ReportService } from '../../services/report.service';
import { 
  DashboardReport, 
  SalesReport, 
  ProductSales,
  InventoryReport,
  ProductStock
} from '../../core/models';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonChip,
    IonIcon,
    IonButton,
    IonButtons
  ]
})
export class ReportsPage implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productsChart') productsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inventoryChart') inventoryChartRef!: ElementRef<HTMLCanvasElement>;

  private salesChart: Chart | null = null;
  private productsChart: Chart | null = null;
  private inventoryChart: Chart | null = null;

  selectedView: string = 'dashboard'; // 'dashboard' | 'sales' | 'products' | 'inventory'
  
  // Dashboard data
  dashboardData: DashboardReport | null = null;
  
  // Sales data
  salesReport: SalesReport | null = null;
  
  // Top products
  topProducts: ProductSales[] = [];
  
  // Inventory data
  inventoryReport: InventoryReport | null = null;
  lowStockProducts: ProductStock[] = [];
  
  loading: boolean = false;
  error: string = '';

  constructor(private reportService: ReportService) {
    addIcons({ 
      trendingUpOutline,
      trendingDownOutline,
      cubeOutline,
      cartOutline,
      alertCircleOutline,
      downloadOutline,
      refreshOutline,
      barChartOutline
    });
  }

  ngOnInit() {
    this.loadDashboard();
  }

  ngAfterViewInit() {
    // Los gráficos se crearán después de cargar datos
  }

  onSegmentChange(event: any) {
    this.selectedView = event.detail.value;
    this.loadDataForView();
  }

  loadDataForView() {
    switch (this.selectedView) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'sales':
        this.loadSalesReport();
        break;
      case 'products':
        this.loadTopProducts();
        break;
      case 'inventory':
        this.loadInventoryReport();
        break;
    }
  }

  loadDashboard() {
    this.loading = true;
    this.error = '';
    
    this.reportService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el dashboard';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  loadSalesReport() {
    this.loading = true;
    this.error = '';
    
    const startDate = new Date();
    startDate.setDate(1); // Primer día del mes
    const endDate = new Date(); // Hoy
    
    console.log('📊 Cargando reporte de ventas...');
    this.reportService.getSalesReport({
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0]
    }).subscribe({
      next: (data) => {
        console.log('✅ Datos del reporte de ventas:', data);
        this.salesReport = data;
        this.loading = false;
        // Crear gráfico después de cargar datos
        setTimeout(() => this.createSalesChart(), 100);
      },
      error: (err) => {
        this.error = 'Error al cargar reporte de ventas';
        this.loading = false;
        console.error('❌ Error en reporte de ventas:', err);
      }
    });
  }

  loadTopProducts() {
    this.loading = true;
    this.error = '';
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Último mes
    const endDate = new Date();
    
    console.log('📊 Cargando top productos...');
    this.reportService.getTopProducts({
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0],
      limit: 10
    }).subscribe({
      next: (data) => {
        console.log('✅ Datos de top productos:', data);
        this.topProducts = data;
        this.loading = false;
        // Crear gráfico después de cargar datos
        setTimeout(() => this.createProductsChart(), 100);
      },
      error: (err) => {
        this.error = 'Error al cargar productos más vendidos';
        this.loading = false;
        console.error('❌ Error en top productos:', err);
      }
    });
  }

  loadInventoryReport() {
    this.loading = true;
    this.error = '';
    
    console.log('📊 Cargando reporte de inventario...');
    this.reportService.getInventoryReport().subscribe({
      next: (data) => {
        console.log('✅ Datos del reporte de inventario:', data);
        this.inventoryReport = data;
        this.lowStockProducts = data.productosStockBajo || [];
        this.loading = false;
        // Crear gráfico después de cargar datos
        setTimeout(() => this.createInventoryChart(), 100);
      },
      error: (err) => {
        this.error = 'Error al cargar reporte de inventario';
        this.loading = false;
        console.error('❌ Error en reporte de inventario:', err);
      }
    });
  }

  async onRefresh(event: any) {
    await this.loadDataForView();
    event.target.complete();
  }

  getChangeColor(value: number): string {
    return value >= 0 ? 'success' : 'danger';
  }

  getChangeIcon(value: number): string {
    return value >= 0 ? 'trending-up-outline' : 'trending-down-outline';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  // ========================================
  // MÉTODOS PARA GRÁFICOS
  // ========================================

  createSalesChart() {
    if (!this.salesChartRef || !this.salesReport) return;

    // Destruir gráfico anterior si existe
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Datos de ejemplo de ventas por día (últimos 7 días)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }));
    }

    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [{
          label: 'Ventas Diarias (MXN)',
          data: this.salesReport.ventas?.slice(0, 7).map(v => v.total || 0) || [0],
          borderColor: '#3880ff',
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            }
          }
        }
      }
    });
  }

  createProductsChart() {
    if (!this.productsChartRef || !this.topProducts.length) return;

    if (this.productsChart) {
      this.productsChart.destroy();
    }

    const ctx = this.productsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const topN = this.topProducts.slice(0, 10);

    this.productsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topN.map(p => p.nombreProducto),
        datasets: [{
          label: 'Unidades Vendidas',
          data: topN.map(p => p.cantidadVendida),
          backgroundColor: [
            '#3880ff', '#10dc60', '#ffce00', '#f04141', '#7044ff',
            '#0cd1e8', '#ffc409', '#eb445a', '#2dd36f', '#3dc2ff'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createInventoryChart() {
    if (!this.inventoryChartRef || !this.inventoryReport) return;

    if (this.inventoryChart) {
      this.inventoryChart.destroy();
    }

    const ctx = this.inventoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const stockOk = (this.inventoryReport.totalProductos || 0) - (this.lowStockProducts.length || 0);
    const stockBajo = this.lowStockProducts.length || 0;

    this.inventoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Stock Normal', 'Stock Bajo'],
        datasets: [{
          data: [stockOk, stockBajo],
          backgroundColor: ['#2dd36f', '#eb445a'],
          hoverBackgroundColor: ['#28ba62', '#cf3c4f']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // ========================================
  // MÉTODOS PARA GENERAR PDF
  // ========================================

  generatePDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.text('FarmaControl - Reporte General', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, pageWidth / 2, 22, { align: 'center' });

    let yPosition = 35;

    switch (this.selectedView) {
      case 'dashboard':
        this.addDashboardToPDF(doc, yPosition);
        break;
      case 'sales':
        this.addSalesReportToPDF(doc, yPosition);
        break;
      case 'products':
        this.addProductsReportToPDF(doc, yPosition);
        break;
      case 'inventory':
        this.addInventoryReportToPDF(doc, yPosition);
        break;
    }

    // Guardar PDF
    doc.save(`reporte-${this.selectedView}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private addDashboardToPDF(doc: jsPDF, startY: number) {
    if (!this.dashboardData) return;

    doc.setFontSize(14);
    doc.text('Dashboard General', 14, startY);

    const data = [
      ['Métrica', 'Valor'],
      ['Ventas Hoy', this.formatCurrency(this.dashboardData.totalVentasHoy || 0)],
      ['Ventas Semana', this.formatCurrency(this.dashboardData.totalVentasSemana || 0)],
      ['Ventas Mes', this.formatCurrency(this.dashboardData.totalVentasMes || 0)],
      ['Total Productos', (this.dashboardData.totalProductos || 0).toString()],
      ['Stock Bajo', (this.dashboardData.productosStockBajo || 0).toString()]
    ];

    autoTable(doc, {
      startY: startY + 10,
      head: [data[0]],
      body: data.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [56, 128, 255] }
    });
  }

  private addSalesReportToPDF(doc: jsPDF, startY: number) {
    if (!this.salesReport) return;

    doc.setFontSize(14);
    doc.text('Reporte de Ventas', 14, startY);

    doc.setFontSize(12);
    doc.text(`Total Ventas: ${this.formatCurrency(this.salesReport.totalVentas || 0)}`, 14, startY + 10);
    doc.text(`Número de Ventas: ${this.salesReport.numeroVentas || 0}`, 14, startY + 17);
    doc.text(`Venta Promedio: ${this.formatCurrency(this.salesReport.ventaPromedio || 0)}`, 14, startY + 24);

    if (this.salesReport.ventas && this.salesReport.ventas.length > 0) {
      const tableData = this.salesReport.ventas.slice(0, 15).map(v => [
        v.id?.toString() || '',
        new Date(v.fechaVenta).toLocaleDateString('es-MX'),
        this.formatCurrency(v.total)
      ]);

      autoTable(doc, {
        startY: startY + 35,
        head: [['ID', 'Fecha', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [56, 128, 255] }
      });
    }
  }

  private addProductsReportToPDF(doc: jsPDF, startY: number) {
    if (!this.topProducts.length) return;

    doc.setFontSize(14);
    doc.text('Top 10 Productos Más Vendidos', 14, startY);

    const tableData = this.topProducts.map(p => [
      p.nombreProducto,
      p.cantidadVendida.toString(),
      this.formatCurrency(p.totalVentas)
    ]);

    autoTable(doc, {
      startY: startY + 10,
      head: [['Producto', 'Unidades', 'Ingresos']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [56, 128, 255] }
    });
  }

  private addInventoryReportToPDF(doc: jsPDF, startY: number) {
    if (!this.inventoryReport) return;

    doc.setFontSize(14);
    doc.text('Reporte de Inventario', 14, startY);

    doc.setFontSize(12);
    doc.text(`Total Productos: ${this.inventoryReport.totalProductos || 0}`, 14, startY + 10);
    doc.text(`Valor Total: ${this.formatCurrency(this.inventoryReport.valorTotalInventario || 0)}`, 14, startY + 17);
    doc.text(`Productos Stock Bajo: ${this.lowStockProducts.length}`, 14, startY + 24);

    if (this.lowStockProducts.length > 0) {
      const tableData = this.lowStockProducts.map(p => [
        p.nombre,
        p.stock.toString(),
        p.stockMinimo.toString(),
        p.categoria
      ]);

      autoTable(doc, {
        startY: startY + 35,
        head: [['Producto', 'Stock', 'Mínimo', 'Categoría']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [235, 68, 90] }
      });
    }
  }
}
