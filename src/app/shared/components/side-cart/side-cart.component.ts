import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../core/models/client.model';
import {
  cartOutline,
  closeOutline,
  addOutline,
  removeOutline,
  trashOutline,
  cardOutline,
  medkitOutline, personOutline } from 'ionicons/icons';
import { CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-side-cart',
  templateUrl: './side-cart.component.html',
  styleUrls: ['./side-cart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption]
})
export class SideCartComponent implements OnInit {
  @Input() isOpen = false;
  @Input() cartItems: CartItem[] = [];
  @Input() cartTotal = 0;
  @Input() cartItemCount = 0;

  @Output() close = new EventEmitter<void>();
  @Output() incrementItem = new EventEmitter<number>();
  @Output() decrementItem = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<number>();
  @Output() proceedToCheckout = new EventEmitter<void>();

  clients: Client[] = [];
  selectedClientId: number | null = null;

  constructor(private clientService: ClientService) {
    addIcons({cartOutline,closeOutline,personOutline,removeOutline,addOutline,trashOutline,cardOutline,medkitOutline});
  }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  closeCart() {
    this.close.emit();
  }

  onIncrementItem(productId: number) {
    this.incrementItem.emit(productId);
  }

  onDecrementItem(productId: number) {
    this.decrementItem.emit(productId);
  }

  onRemoveItem(productId: number) {
    this.removeItem.emit(productId);
  }

  onProceedToCheckout() {
    this.proceedToCheckout.emit();
  }

  getProductIcon(productName: string): string {
    const name = productName.toLowerCase();

    // Iconos contextuales para productos farmacéuticos
    if (name.includes('pastilla') || name.includes('tableta') || name.includes('cápsula')) {
      return 'medkit-outline';
    }
    if (name.includes('jarabe') || name.includes('líquido') || name.includes('gotas')) {
      return 'water-outline';
    }
    if (name.includes('crema') || name.includes('ungüento') || name.includes('gel')) {
      return 'bandage-outline';
    }
    if (name.includes('vitamina') || name.includes('suplemento')) {
      return 'fitness-outline';
    }
    if (name.includes('termómetro')) {
      return 'thermometer-outline';
    }
    if (name.includes('jeringa') || name.includes('inyección')) {
      return 'medical-outline';
    }

    // Icono por defecto
    return 'medkit-outline';
  }
}