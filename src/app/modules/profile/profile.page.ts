import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  personCircleOutline,
  informationCircleOutline,
  personOutline,
  mailOutline,
  shieldCheckmarkOutline,
  keyOutline,
  calendarOutline,
  timeOutline,
  statsChartOutline,
  cartOutline,
  cashOutline,
  createOutline,
  lockClosedOutline,
  checkmarkCircle,
  closeCircle,
  logoGoogle
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonChip,
    IonSpinner
  ]
})
export class ProfilePage implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ 
      logOutOutline, 
      personCircleOutline,
      informationCircleOutline,
      personOutline,
      mailOutline,
      shieldCheckmarkOutline,
      keyOutline,
      calendarOutline,
      timeOutline,
      statsChartOutline,
      cartOutline,
      cashOutline,
      createOutline,
      lockClosedOutline,
      checkmarkCircle,
      closeCircle,
      logoGoogle
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.user = this.authService.getCurrentUser();
    console.log('👤 Usuario cargado:', this.user);
  }

  isGoogleUser(): boolean {
    // Un usuario de Google tiene un passwordHash que empieza con el UID de Firebase
    // o no tiene un hash BCrypt típico (que empieza con $2a$ o $2b$)
    if (!this.user || !this.user.passwordHash) return false;
    
    // Si el passwordHash no tiene el formato BCrypt, es de Google
    const isBcrypt = this.user.passwordHash.startsWith('$2a$') || 
                     this.user.passwordHash.startsWith('$2b$') ||
                     this.user.passwordHash.startsWith('$2y$');
    
    return !isBcrypt;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-MX', options);
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      message: 'Esta funcionalidad estará disponible próximamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      message: 'Esta funcionalidad estará disponible próximamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}
