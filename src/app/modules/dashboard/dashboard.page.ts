import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  IonCardContent,
  IonIcon,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trendingUpOutline, 
  cubeOutline, 
  peopleOutline, 
  cartOutline,
  refreshOutline,
  warningOutline
} from 'ionicons/icons';
import { ReportService } from '../../services/report.service';
import { DashboardReport, DashboardResponse } from '../../core/models';

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
    IonCardContent,
    IonIcon,
    IonButton,
    IonSpinner
  ]
})
export class DashboardPage implements OnInit {
  dashboardData: DashboardReport | null = null;
  loading = false;
  error = '';

  constructor(private reportService: ReportService) {
    console.log('🏗️ DASHBOARD - Constructor ejecutado');
    addIcons({ 
      trendingUpOutline, 
      cubeOutline, 
      peopleOutline, 
      cartOutline,
      refreshOutline,
      warningOutline
    });
  }

  ngOnInit() {
    console.log('🚀 DASHBOARD - ngOnInit ejecutado');
    this.loadDashboard();
  }

  loadDashboard() {
    console.log('📊 DASHBOARD - Iniciando carga...');
    this.loading = true;
    this.error = '';
    
    this.reportService.getDashboard().subscribe({
      next: (data: DashboardReport) => {
        console.log('✅ DASHBOARD - Datos recibidos:', data);
        this.dashboardData = data;
        console.log('💾 dashboardData final:', this.dashboardData);
        this.loading = false;
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

  handleRefresh(event: any) {
    this.loadDashboard();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
