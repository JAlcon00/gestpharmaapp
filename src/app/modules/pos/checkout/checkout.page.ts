import { Component, OnInit, inject } from '@angular/core';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartService, CartItem } from '../../../services/cart.service';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { SaleCreateRequest, SaleDetailRequest, Client, Product } from '../../../core/models';

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
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

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

  constructor() {
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

    // Validar que hay suficiente stock para todos los productos
    const insufficientStock = this.cartItems.filter(item => item.quantity > item.product.stock);
    if (insufficientStock.length > 0) {
      const productNames = insufficientStock.map(item => item.product.nombre).join(', ');
      this.error = `Stock insuficiente para: ${productNames}`;
      await this.showErrorAlert(this.error);
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
           console.log('✅ Venta creada exitosamente:', sale.id);

           // Actualizar stock de productos después de venta exitosa
           await this.updateProductStock();

           await loading.dismiss();
           this.cartService.clear();
           await this.showSuccessAlert(sale.id);
         },
         error: async (err) => {
           await loading.dismiss();
           console.error('❌ Error procesando venta:', err);
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
      buttons: [
        {
          text: 'Generar Recibo',
          handler: () => {
            this.generateReceipt(saleId);
          }
        },
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();

    // Redirigir al POS después de cerrar el alert
    this.router.navigate(['/tabs/pos']);
  }

  generateReceipt(saleId: number) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('RECIBO DE VENTA', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('GestPharma - Sistema de Gestión Farmacéutica', 105, 30, { align: 'center' });
    doc.text(`Venta #${saleId}`, 105, 40, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 50, { align: 'center' });

    // Client info
    let yPosition = 70;
    if (this.selectedClient || this.clientMode === 'new') {
      doc.setFontSize(14);
      doc.text('Cliente:', 20, yPosition);
      yPosition += 10;

      const clientName = this.selectedClient
        ? `${this.selectedClient.nombre} ${this.selectedClient.apellido}`
        : this.clientMode === 'new'
        ? `${this.checkoutForm.value.clienteNombre} ${this.checkoutForm.value.clienteApellido}`
        : 'Cliente General';

      doc.setFontSize(12);
      doc.text(clientName, 20, yPosition);
      yPosition += 20;
    }

    // Products table
    const tableData = this.cartItems.map(item => [
      item.product.nombre,
      item.quantity.toString(),
      `$${item.product.precio.toFixed(2)}`,
      `$${item.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [56, 128, 255] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total: $${this.cartTotal.toFixed(2)} MXN`, 150, finalY, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.text('Gracias por su compra', 105, finalY + 20, { align: 'center' });
    doc.text('GestPharma - Sistema de Gestión Farmacéutica', 105, finalY + 30, { align: 'center' });

    // Save the PDF
    doc.save(`recibo-venta-${saleId}.pdf`);
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Actualiza el stock de productos después de una venta exitosa
   */
  private async updateProductStock(): Promise<void> {
    console.log('📦 Actualizando stock de productos...');
    console.log('📋 Items en carrito:', this.cartItems.length);

    const stockUpdates: Promise<any>[] = [];

    for (const item of this.cartItems) {
      const newStock = item.product.stock - item.quantity;

      console.log(`🔄 Producto: ${item.product.nombre}`);
      console.log(`   Stock actual: ${item.product.stock}`);
      console.log(`   Cantidad vendida: ${item.quantity}`);
      console.log(`   Nuevo stock: ${newStock}`);

      // Enviar todos los campos requeridos del producto
      const updateData = {
        nombre: item.product.nombre,
        descripcion: item.product.descripcion,
        precio: item.product.precio,
        stock: newStock,
        categoriaId: item.product.categoriaId,
        codigoBarras: item.product.codigoBarras,
        lote: item.product.lote,
        fechaVencimiento: item.product.fechaVencimiento,
        stockMinimo: item.product.stockMinimo,
        activo: item.product.activo
      };

      const updatePromise = this.productService.update(item.product.id, updateData).toPromise()
        .then(updatedProduct => {
          console.log(`✅ Stock actualizado para ${item.product.nombre}:`, updatedProduct?.stock);
          return updatedProduct;
        })
        .catch(error => {
          console.error(`❌ Error actualizando stock de ${item.product.nombre}:`, error);
          console.error('   Detalles del error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return null;
        });

      stockUpdates.push(updatePromise);
    }

    try {
      const results = await Promise.all(stockUpdates);
      const successCount = results.filter(r => r !== null).length;
      console.log(`✅ Stock actualizado: ${successCount}/${this.cartItems.length} productos`);

      // Limpiar caché de productos para forzar recarga
      this.clearProductCache();

      if (successCount < this.cartItems.length) {
        await this.showStockUpdateWarning();
      }

    } catch (error) {
      console.error('❌ Error actualizando stock:', error);
      await this.showStockUpdateWarning();
    }
  }

  /**
   * Limpia la caché de productos del localStorage
   */
  private clearProductCache(): void {
    try {
      // Limpiar caché de lista de productos
      localStorage.removeItem('cache_products');

      // Limpiar caché individual de cada producto vendido
      this.cartItems.forEach(item => {
        localStorage.removeItem(`cache_product_${item.product.id}`);
      });

      console.log('🧹 Caché de productos limpiada');
    } catch (error) {
      console.warn('Error limpiando caché:', error);
    }
  }

  /**
   * Muestra alerta de advertencia cuando falla la actualización de stock
   */
  private async showStockUpdateWarning() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'La venta se procesó correctamente, pero pudo haber un problema al actualizar el inventario. Por favor verifica los niveles de stock manualmente.',
      buttons: ['Entendido']
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
