import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
  IonFab,
  IonFabButton,
  IonChip,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  addOutline,
  removeOutline,
  trashOutline,
  searchOutline,
  personAddOutline
} from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { ClientService } from '../../services/client.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Product } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card';
import { SideCartComponent } from '../../shared/components/side-cart/side-cart.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonText,
    IonFab,
    IonFabButton,
    IonChip,
    ProductCardComponent,
    SideCartComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    SkeletonComponent
  ]
})
export class PosPage implements OnInit {
  private productService = inject(ProductService);
  private clientService = inject(ClientService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  products: Product[] = [];
  cartItems: CartItem[] = [];
  loading = false;
  searchQuery = '';
  cartOpen = false;
  private searchSubject = new Subject<string>();

  constructor() {
    addIcons({
      cartOutline,
      addOutline,
      removeOutline,
      trashOutline,
      searchOutline,
      personAddOutline
    });
  }

  ngOnInit() {
    // Suscribirse al carrito
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    // Búsqueda con debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      if (query.length >= 2) {
        this.searchProducts(query);
      } else if (query.length === 0) {
        this.loadProducts();
      }
    });
  }

  ionViewWillEnter() {
    // Recargar productos cada vez que se entra a la vista
    // Esto actualiza el stock después de una venta
    console.log('🔄 POS - Recargando productos...');
    this.clearProductCache();
    this.loadProducts();
  }

  /**
   * Limpia la caché de productos para forzar recarga desde el backend
   */
  private clearProductCache(): void {
    try {
      // Limpiar todas las entradas de caché relacionadas con productos
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_product')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 Caché de productos limpiada en POS');
    } catch (error) {
      console.warn('Error limpiando caché:', error);
    }
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll({ size: 50 }).subscribe({
      next: (response) => {
        // El backend puede devolver array directo o PagedResponse
        this.products = Array.isArray(response) ? response : (response.content || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.products = [];
        this.loading = false;
      }
    });
  }

  searchProducts(query: string) {
    this.loading = true;
    this.productService.search(query, { size: 50 }).subscribe({
      next: (response) => {
        // El backend puede devolver array directo o PagedResponse
        this.products = Array.isArray(response) ? response : (response.content || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error buscando productos:', err);
        this.products = [];
        this.loading = false;
      }
    });
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value || '';
    this.searchSubject.next(this.searchQuery);
  }

  addToCart(product: Product) {
    console.log('➕ POS - Adding to cart:', {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    });
    if (product.stock > 0) {
      this.cartService.addItem(product, 1);
    }
  }

  incrementQuantity(productId: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item && item.quantity < item.product.stock) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeItem(productId);
  }

  getCartItemQuantity(productId: number): number {
    const item = this.cartItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some(i => i.product.id === productId);
  }

  get cartTotal(): number {
    return this.cartService.getTotal();
  }

  get cartItemCount(): number {
    return this.cartService.getItemCount();
  }

  goToCheckout() {
    this.closeCart();
    if (!this.cartService.isEmpty()) {
      this.router.navigate(['/tabs/pos/checkout']);
    }
  }

  openCart() {
    this.cartOpen = true;
  }

  closeCart() {
    this.cartOpen = false;
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadProducts();
  }

  async addNewClient() {
    const alert = await this.alertController.create({
      header: 'Nuevo Cliente',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          attributes: { required: true }
        },
        {
          name: 'apellido',
          type: 'text',
          placeholder: 'Apellido',
          attributes: { required: true }
        },
        {
          name: 'telefono',
          type: 'tel',
          placeholder: 'Teléfono',
          attributes: { required: true }
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico',
          attributes: { required: true }
        },
        {
          name: 'direccion',
          type: 'textarea',
          placeholder: 'Dirección (opcional)'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre || !data.apellido || !data.telefono || !data.email) {
              this.showToast('Complete todos los campos requeridos', 'warning');
              return false;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
              this.showToast('Ingrese un email válido', 'warning');
              return false;
            }
            
            this.createClient(data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  createClient(data: any) {
    const newClient = {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      telefono: data.telefono.trim(),
      email: data.email.trim(),
      direccion: data.direccion?.trim() || null
    };

    console.log('📤 Enviando cliente al backend:', newClient);

    this.clientService.create(newClient).subscribe({
      next: (client) => {
        this.showToast(`Cliente "${client.nombre} ${client.apellido}" creado exitosamente`, 'success');
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        const errorMsg = err?.error?.message || err?.message || 'Error al crear cliente';
        this.showToast(errorMsg, 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
