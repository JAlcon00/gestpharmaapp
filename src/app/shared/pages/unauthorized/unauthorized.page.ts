import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-unauthorized',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Acceso Denegado</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 40%;">
        <ion-icon name="lock-closed-outline" style="font-size: 5rem; color: var(--ion-color-danger);"></ion-icon>
        <ion-text>
          <h2>No tienes permiso</h2>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
        </ion-text>
        <ion-button (click)="goBack()">
          Volver al Inicio
        </ion-button>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonText]
})
export class UnauthorizedPage {
  private router = inject(Router);

  constructor() {
    addIcons({ lockClosedOutline });
  }

  goBack() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
