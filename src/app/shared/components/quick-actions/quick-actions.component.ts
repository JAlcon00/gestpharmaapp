import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
  standalone: true,
  imports: [RouterModule, IonFab, IonFabButton, IonFabList, IonIcon, IonLabel]
})
export class QuickActionsComponent {}