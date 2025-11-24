import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonText,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  receiptOutline,
  personOutline,
  personAddOutline
} from 'ionicons/icons';
import { CartService, CartItem } from '../../../services/cart.service';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { SaleCreateRequest, SaleDetailRequest, Client } from '../../../core/models';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonSpinner,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption
  ]
})
export class CheckoutPage implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartItemCount: number = 0;
  loading = false;
  error = '';
  
  // Client selection
  clientMode: 'none' | 'new' | 'existing' = 'none';
  selectedClient: Client | null = null;
  selectedClientId: number | null = null;
  allClients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private saleService: SaleService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      receiptOutline,
      personOutline,
      personAddOutline
    });
  }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.calculateTotals();
    
    // DEBUG: Ver qué contiene el carrito
    console.log('🛒 CHECKOUT - Cart Items:', this.cartItems);
    this.cartItems.forEach((item, index) => {
      console.log(`📦 Item ${index + 1}:`, {
        nombre: item.product.nombre,
        precio: item.product.precio,
        cantidad: item.quantity,
        subtotal: item.subtotal
      });
    });
    console.log('💰 Total calculado:', this.cartTotal);

    if (this.cartItems.length === 0) {
      this.router.navigate(['/tabs/pos']);
      return;
    }

    this.checkoutForm = this.fb.group({
      clienteNombre: ['', Validators.required],
      clienteApellido: ['', Validators.required],
      clienteEmail: ['', [Validators.required, Validators.email]],
      clienteTelefono: ['', Validators.required],
      clienteDireccion: [''],
      clienteRfc: [''],
      observaciones: ['']
    });

    // Load all clients for dropdown
    this.loadAllClients();
  }

  calculateTotals() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
    this.cartItemCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
    console.log('🔄 Totals recalculated:', { total: this.cartTotal, items: this.cartItemCount });
  }

  loadAllClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.allClients = clients;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.allClients = [];
      }
    });
  }

  onClientModeChange(event: any) {
    this.clientMode = event.detail.value;
    this.selectedClient = null;
    this.selectedClientId = null;
    
    if (this.clientMode === 'none') {
      this.checkoutForm.patchValue({
        clienteNombre: '',
        clienteApellido: '',
        clienteEmail: '',
        clienteTelefono: '',
        clienteDireccion: '',
        clienteRfc: ''
      });
      this.checkoutForm.get('clienteNombre')?.clearValidators();
      this.checkoutForm.get('clienteApellido')?.clearValidators();
      this.checkoutForm.get('clienteEmail')?.clearValidators();
      this.checkoutForm.get('clienteTelefono')?.clearValidators();
    } else if (this.clientMode === 'new') {
      this.checkoutForm.get('clienteNombre')?.setValidators([Validators.required]);
      this.checkoutForm.get('clienteApellido')?.setValidators([Validators.required]);
      this.checkoutForm.get('clienteEmail')?.setValidators([Validators.required, Validators.email]);
      this.checkoutForm.get('clienteTelefono')?.setValidators([Validators.required]);
    }
    this.checkoutForm.get('clienteNombre')?.updateValueAndValidity();
    this.checkoutForm.get('clienteApellido')?.updateValueAndValidity();
    this.checkoutForm.get('clienteEmail')?.updateValueAndValidity();
    this.checkoutForm.get('clienteTelefono')?.updateValueAndValidity();
  }

  onClientSelected(event: any) {
    const clientId = event.detail.value;
    if (clientId) {
      this.selectedClient = this.allClients.find(c => c.id === clientId) || null;
    } else {
      this.selectedClient = null;
    }
  }

  async processSale() {
    if (this.cartItems.length === 0) {
      return;
    }

    // Validate client info if mode is 'new'
    if (this.clientMode === 'new' && this.checkoutForm.invalid) {
      this.error = 'Por favor completa la información del cliente';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando venta...',
    });
    await loading.present();

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        await loading.dismiss();
        this.error = 'No se pudo identificar el usuario';
        return;
      }

      let clienteId: number | undefined;

      // If mode is 'existing', use selected client
      if (this.clientMode === 'existing' && this.selectedClient) {
        clienteId = this.selectedClient.id;
      }
      // If mode is 'new', create new client first
      else if (this.clientMode === 'new') {
        const newClient = await this.clientService.create({
          nombre: this.checkoutForm.value.clienteNombre,
          apellido: this.checkoutForm.value.clienteApellido,
          email: this.checkoutForm.value.clienteEmail,
          telefono: this.checkoutForm.value.clienteTelefono,
          direccion: this.checkoutForm.value.clienteDireccion || undefined,
          rfc: this.checkoutForm.value.clienteRfc || undefined
        }).toPromise();
        clienteId = newClient?.id;
      }

      // Preparar detalles de la venta
      const detalles: SaleDetailRequest[] = this.cartItems.map(item => {
        console.log('📦 Cart Item:', {
          id: item.product.id,
          nombre: item.product.nombre,
          precio: item.product.precio,
          cantidad: item.quantity,
          subtotal: item.subtotal
        });
        return {
          productoId: item.product.id,
          cantidad: item.quantity,
          precioUnitario: item.product.precio
        };
      });

      const saleRequest: SaleCreateRequest = {
        detalles,
        clienteId,
        observaciones: this.checkoutForm.value.observaciones || undefined
      };

      console.log('🛒 Sale Request:', JSON.stringify(saleRequest, null, 2));

      this.saleService.create(saleRequest).subscribe({
        next: async (sale) => {
          await loading.dismiss();
          this.cartService.clear();
          await this.showSuccessAlert(sale.id);
        },
        error: async (err) => {
          await loading.dismiss();
          console.error('Error procesando venta:', err);
          this.error = err.message || 'Error al procesar la venta';
          await this.showErrorAlert(this.error);
        }
      });
    } catch (error: any) {
      await loading.dismiss();
      this.error = error.message || 'Error al crear el cliente';
      await this.showErrorAlert(this.error);
    }
  }

  async showSuccessAlert(saleId: number) {
    const alert = await this.alertController.create({
      header: '¡Venta Exitosa!',
      message: `La venta #${saleId} se procesó correctamente por un total de ${this.cartTotal.toFixed(2)} MXN`,
      buttons: ['OK']
    });

    await alert.present();
    await alert.onDidDismiss();
    
    // Redirigir al POS después de cerrar el alert
    this.router.navigate(['/tabs/pos']);
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmCancel() {
    const alert = await this.alertController.create({
      header: 'Cancelar Venta',
      message: '¿Estás seguro que deseas cancelar esta venta? Se perderán todos los items del carrito.',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, Cancelar',
          role: 'destructive',
          handler: () => {
            this.cartService.clear();
            this.router.navigate(['/tabs/pos']);
          }
        }
      ]
    });

    await alert.present();
  }
}
