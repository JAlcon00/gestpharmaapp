import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  removeOutline,
  closeCircleOutline,
  eyeOutline,
  checkmarkCircleOutline,
  warningOutline,
  cartOutline
} from 'ionicons/icons';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isInCart = false;
  @Input() quantity = 0;
  @Input() hasDiscount = false;
  @Input() discountPercent = 0;
  @Input() originalPrice = 0;

  @Output() addToCart = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();

  constructor() {
    addIcons({
      addOutline,
      removeOutline,
      closeCircleOutline,
      eyeOutline,
      checkmarkCircleOutline,
      warningOutline,
      cartOutline
    });
  }

  onAddToCart() {
    this.addToCart.emit();
  }

  onIncrement() {
    this.increment.emit();
  }

  onDecrement() {
    this.decrement.emit();
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

  getStockStatus(stock: number): string {
    if (stock === 0) return 'critical';
    if (stock < 10) return 'low';
    return 'optimal';
  }

  getStockIcon(stock: number): string {
    if (stock === 0) return 'close-circle-outline';
    if (stock < 10) return 'warning-outline';
    return 'checkmark-circle-outline';
  }
}