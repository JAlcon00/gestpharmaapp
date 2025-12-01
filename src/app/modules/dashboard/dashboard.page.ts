import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trendingUpOutline,
  cubeOutline,
  peopleOutline,
  cartOutline,
  refreshOutline,
  warningOutline,
  barChartOutline,
  timeOutline, statsChartOutline } from 'ionicons/icons';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ReportService } from '../../services/report.service';
import { SaleService } from '../../services/sale.service';
import { DashboardReport, SalesReport, ProductSales, Sale } from '../../core/models';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { QuickActionsComponent } from '../../shared/components/quick-actions/quick-actions.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

// Registrar componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    ButtonComponent,
    CardComponent,
     KpiCardComponent,
     ThemeToggleComponent,
     QuickActionsComponent,
     SkeletonComponent
  ]
})
export class DashboardPage implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private saleService = inject(SaleService);
  private router = inject(Router);

  dashboardData: DashboardReport | null = null;
  loading = false;
  error = '';

  // Nuevos datos para dashboard completo
  recentSales: Sale[] = [];
  topProducts: ProductSales[] = [];
  salesChartData: any[] = [];

  // Referencias para gráficos
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  private salesChart: Chart | null = null;

  constructor() {
    console.log('🏗️ DASHBOARD - Constructor ejecutado');
    addIcons({trendingUpOutline,statsChartOutline,timeOutline,cubeOutline,peopleOutline,cartOutline,refreshOutline,warningOutline,barChartOutline});
  }

  ngOnInit() {
    console.log('🚀 DASHBOARD - ngOnInit ejecutado');
    this.loadDashboard();
  }

  ngOnDestroy() {
    // Cleanup will be handled by Angular
  }

  // Keyboard shortcuts para quick actions
  @HostListener('document:keydown.control.n', ['$event'])
  onNewSale(event: any) {
    event.preventDefault();
    this.router.navigate(['/tabs/pos']);
  }

  @HostListener('document:keydown.control.p', ['$event'])
  onAddProduct(event: any) {
    event.preventDefault();
    this.router.navigate(['/tabs/inventory']);
  }

  @HostListener('document:keydown.control.r', ['$event'])
  onViewReports(event: any) {
    event.preventDefault();
    this.router.navigate(['/tabs/reports']);
  }

  loadDashboard() {
    console.log('📊 DASHBOARD - Iniciando carga...');
    this.loading = true;
    this.error = '';

    // Cargar datos del dashboard
    this.reportService.getDashboard().subscribe({
      next: (data: DashboardReport) => {
        console.log('✅ DASHBOARD - Datos recibidos:', data);
        this.dashboardData = data;
        this.loadAdditionalData();
      },
      error: (err) => {
        console.error('❌ DASHBOARD - Error cargando:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.error = 'Error al cargar los datos. Verifica que el backend esté corriendo.';
        this.loading = false;
      }
    });
  }

  private loadAdditionalData() {
    console.log('📊 DASHBOARD - Cargando datos adicionales...');

    // Cargar ventas recientes
    this.saleService.getAll({ page: 0, size: 5 }).subscribe({
      next: (response) => {
        this.recentSales = response.content || [];
        console.log('✅ Ventas recientes:', this.recentSales);
        this.checkAllDataLoaded();
      },
      error: (err) => {
        console.error('❌ Error cargando ventas recientes:', err);
        this.checkAllDataLoaded();
      }
    });

    // Cargar productos más vendidos
    this.reportService.getTopProducts({ limit: 5 }).subscribe({
      next: (products) => {
        this.topProducts = products;
        console.log('✅ Productos top:', this.topProducts);
        this.checkAllDataLoaded();
      },
      error: (err) => {
        console.error('❌ Error cargando productos top:', err);
        this.checkAllDataLoaded();
      }
    });

    // Cargar datos para gráfico de ventas (últimos 7 días)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.reportService.getSalesReport({
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0]
    }).subscribe({
      next: (report) => {
        this.salesChartData = report.ventas || [];
        console.log('✅ Datos para gráfico:', this.salesChartData);
        this.checkAllDataLoaded();
      },
      error: (err) => {
        console.error('❌ Error cargando datos de ventas:', err);
        this.checkAllDataLoaded();
      }
    });
  }

  private checkAllDataLoaded() {
    // Cuando todos los datos estén cargados, crear el gráfico
    if (this.dashboardData && this.recentSales && this.topProducts && this.salesChartData !== undefined) {
      this.loading = false;
      setTimeout(() => this.createSalesChart(), 100);
    }
  }

  handleRefresh(event: any) {
    this.loadDashboard();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  private createSalesChart() {
    if (!this.salesChartRef || !this.salesChartData.length) return;

    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Preparar datos para el gráfico (últimos 7 días)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const salesByDay = last7Days.map(date => {
      const daySales = this.salesChartData.filter((sale: any) =>
        sale.fechaVenta?.startsWith(date)
      );
      return daySales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    });

    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Ventas Diarias',
          data: salesByDay,
          borderColor: '#00D9A3', // Color brand primary
          backgroundColor: 'rgba(0, 217, 163, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#00D9A3',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#00D9A3',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#212121',
            bodyColor: '#616161',
            borderColor: 'rgba(0, 217, 163, 0.2)',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return 'Ventas: $' + (context.parsed.y || 0).toLocaleString('es-MX');
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9e9e9e',
              font: {
                size: 12,
                weight: 500
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 217, 163, 0.1)',
              lineWidth: 1
            },
            ticks: {
              color: '#9e9e9e',
              font: {
                size: 12,
                weight: 500
              },
              callback: function(value: any) {
                return '$' + value.toLocaleString('es-MX');
              }
            }
          }
        },
        elements: {
          point: {
            hoverBorderWidth: 3
          }
        }
      }
    });
  }
}
