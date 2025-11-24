import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonSpinner,
  AlertController,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add, 
  search, 
  filterOutline, 
  createOutline, 
  trashOutline,
  alertCircleOutline,
  checkmarkCircle,
  closeCircle
} from 'ionicons/icons';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../core/models';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonChip,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonSpinner
  ]
})
export class InventoryPage implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedView: string = 'products'; // 'products' | 'categories'
  
  loading: boolean = false;
  error: string = '';
  
  // Paginación
  page: number = 0;
  size: number = 20;
  totalPages: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router
  ) {
    addIcons({ 
      add, 
      search, 
      filterOutline, 
      createOutline, 
      trashOutline,
      alertCircleOutline,
      checkmarkCircle,
      closeCircle
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        // El backend puede devolver array directo o PagedResponse
        this.categories = Array.isArray(response) ? response : (response.content || []);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categories = [];
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    const request = this.selectedCategory === 'all'
      ? this.productService.getAll({ page: this.page, size: this.size })
      : this.productService.getByCategory(Number(this.selectedCategory), { page: this.page, size: this.size });

    request.subscribe({
      next: (response) => {
        // El backend puede devolver array directo o PagedResponse
        if (Array.isArray(response)) {
          this.products = response;
          this.totalPages = 1;
        } else {
          this.products = response.content || [];
          this.totalPages = response.totalPages || 0;
        }
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos';
        this.products = [];
        this.filteredProducts = [];
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  onSearchChange(event: any) {
    const term = event.detail.value?.toLowerCase() || '';
    this.searchTerm = term;

    if (!term) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(term) ||
      product.descripcion?.toLowerCase().includes(term) ||
      product.codigoBarras?.toLowerCase().includes(term)
    );
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.page = 0;
    this.loadProducts();
  }

  onSegmentChange(event: any) {
    this.selectedView = event.detail.value;
  }

  async onRefresh(event: any) {
    this.page = 0;
    await this.loadProducts();
    await this.loadCategories();
    event.target.complete();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.nombre || 'Sin categoría';
  }

  getStockStatus(stock: number, stockMinimo: number): string {
    if (stock <= 0) return 'danger';
    if (stock <= stockMinimo) return 'warning';
    return 'success';
  }

  getStockLabel(stock: number, stockMinimo: number): string {
    if (stock <= 0) return 'Agotado';
    if (stock <= stockMinimo) return 'Stock bajo';
    return 'Disponible';
  }

  async addProduct() {
    if (this.categories.length === 0) {
      this.showToast('Debe crear al menos una categoría primero', 'warning');
      return;
    }

    // Primero mostrar action sheet para seleccionar categoría
    const categoryButtons = this.categories.map(cat => ({
      text: cat.nombre,
      handler: () => {
        this.showProductForm(cat.id, 'create');
      }
    }));

    const actionSheet = await this.alertController.create({
      header: 'Seleccione una categoría',
      buttons: [
        ...categoryButtons,
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async showProductForm(categoriaId: number, mode: 'create' | 'edit', product?: Product) {
    const categoryName = this.categories.find(c => c.id === categoriaId)?.nombre || 'Sin categoría';
    
    const alert = await this.alertController.create({
      header: mode === 'create' ? 'Agregar Producto' : 'Editar Producto',
      message: `<strong>Categoría:</strong> ${categoryName}`,
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: product?.nombre || '',
          attributes: { required: true }
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción',
          value: product?.descripcion || ''
        },
        {
          name: 'codigoBarras',
          type: 'text',
          placeholder: 'Código de barras',
          value: product?.codigoBarras || ''
        },
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Precio',
          value: product?.precio || '',
          attributes: { min: 0, step: 0.01, required: true }
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock inicial',
          value: product?.stock || '',
          attributes: { min: 0, required: true }
        },
        {
          name: 'stockMinimo',
          type: 'number',
          placeholder: 'Stock mínimo',
          value: product?.stockMinimo || 10,
          attributes: { min: 0 }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre || !data.precio || data.stock === undefined) {
              this.showToast('Complete los campos requeridos', 'warning');
              return false;
            }
            
            if (mode === 'create') {
              this.createProduct({ ...data, categoriaId });
            } else {
              this.updateProduct(product!.id!, { ...data, categoriaId });
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  createProduct(data: any) {
    // La categoría debe venir en data.categoriaId desde el formulario
    if (!data.categoriaId) {
      this.showToast('Debe seleccionar una categoría', 'warning');
      return;
    }
    
    const newProduct: Partial<Product> = {
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      codigoBarras: data.codigoBarras || null,
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock),
      stockMinimo: parseInt(data.stockMinimo) || 10,
      categoriaId: Number(data.categoriaId),
      activo: true
    };

    this.productService.create(newProduct as Product).subscribe({
      next: (createdProduct) => {
        this.showToast('Producto creado exitosamente', 'success');
        // Actualización optimista: agregar el producto a la lista local
        this.products.unshift(createdProduct);
        this.filteredProducts = [...this.products];
        this.applyCurrentFilters();
      },
      error: (err) => {
        this.showToast('Error al crear producto', 'danger');
        console.error('Error:', err);
      }
    });
  }

  async editProduct(product: Product) {
    // Para edición, usar directamente la categoría actual del producto
    // El usuario puede ver la categoría en el mensaje del formulario
    this.showProductForm(product.categoriaId || 0, 'edit', product);
  }

  updateProduct(id: number, data: any) {
    const updatedProduct: Partial<Product> = {
      ...data,
      categoriaId: Number(data.categoriaId), // ✅ Incluir categoriaId del formulario
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock),
      stockMinimo: parseInt(data.stockMinimo) || 10
    };

    this.productService.update(id, updatedProduct as Product).subscribe({
      next: (updated) => {
        this.showToast('Producto actualizado exitosamente', 'success');
        // Actualización optimista: actualizar el producto en la lista local
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updated };
          this.filteredProducts = [...this.products];
          this.applyCurrentFilters();
        }
      },
      error: (err) => {
        this.showToast('Error al actualizar producto', 'danger');
        console.error('Error:', err);
      }
    });
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar el producto "${product.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.productService.delete(product.id!).subscribe({
              next: () => {
                this.showToast('Producto eliminado exitosamente', 'success');
                // Actualización optimista: eliminar el producto de la lista local
                this.products = this.products.filter(p => p.id !== product.id);
                this.filteredProducts = [...this.products];
                this.applyCurrentFilters();
              },
              error: (err) => {
                this.showToast('Error al eliminar producto', 'danger');
                console.error('Error:', err);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async addCategory() {
    const alert = await this.alertController.create({
      header: 'Agregar Categoría',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          attributes: { required: true }
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre) {
              this.showToast('El nombre es requerido', 'warning');
              return false;
            }
            this.createCategory(data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  createCategory(data: any) {
    const newCategory: Partial<Category> = {
      nombre: data.nombre,
      descripcion: data.descripcion || ''
    };

    this.categoryService.create(newCategory as Category).subscribe({
      next: () => {
        this.showToast('Categoría creada exitosamente', 'success');
        this.loadCategories();
      },
      error: (err) => {
        this.showToast('Error al crear categoría', 'danger');
        console.error('Error:', err);
      }
    });
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: category.nombre,
          attributes: { required: true }
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción',
          value: category.descripcion || ''
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre) {
              this.showToast('El nombre es requerido', 'warning');
              return false;
            }
            this.updateCategory(category.id!, data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // Método auxiliar para reaplicar filtros actuales sin llamar al servidor
  private applyCurrentFilters() {
    let filtered = [...this.products];

    // Aplicar filtro de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(term) ||
        product.descripcion?.toLowerCase().includes(term) ||
        product.codigoBarras?.toLowerCase().includes(term)
      );
    }

    // Aplicar filtro de categoría
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categoriaId === Number(this.selectedCategory)
      );
    }

    this.filteredProducts = filtered;
  }

  updateCategory(id: number, data: any) {
    this.categoryService.update(id, data as Category).subscribe({
      next: (updated) => {
        this.showToast('Categoría actualizada exitosamente', 'success');
        // Actualización optimista: actualizar categoría en lista local
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...updated };
        }
      },
      error: (err) => {
        this.showToast('Error al actualizar categoría', 'danger');
        console.error('Error:', err);
      }
    });
  }

  async deleteCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar la categoría "${category.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.categoryService.delete(category.id!).subscribe({
              next: () => {
                this.showToast('Categoría eliminada exitosamente', 'success');
                // Actualización optimista: eliminar categoría de lista local
                this.categories = this.categories.filter(c => c.id !== category.id);
              },
              error: (err) => {
                this.showToast('Error al eliminar categoría', 'danger');
                console.error('Error:', err);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
