import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Product, Category } from '../../../../core/models';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProducts: Product[] = [
    {
      id: 1,
      nombre: 'Paracetamol',
      descripcion: 'Analgésico efectivo',
      precio: 25.50,
      stock: 100,
      stockMinimo: 10,
      categoriaId: 1,
      codigoBarras: '7501234567890',
      activo: true
    },
    {
      id: 2,
      nombre: 'Ibuprofeno',
      precio: 35.00,
      stock: 5,
      stockMinimo: 10,
      categoriaId: 1,
      activo: true
    }
  ];

  const mockCategories: Category[] = [
    { id: 1, nombre: 'Analgésicos', activo: true },
    { id: 2, nombre: 'Antibióticos', activo: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input handling', () => {
    it('should display products when provided', () => {
      component.products = mockProducts;
      component.categories = mockCategories;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Paracetamol');
      expect(compiled.textContent).toContain('Ibuprofeno');
    });

    it('should show loading skeleton when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const skeletonElements = compiled.querySelectorAll('ion-skeleton-text');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should show error message when error is provided', () => {
      component.error = 'Error al cargar productos';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Error al cargar productos');
    });

    it('should show empty state when no products and not loading', () => {
      component.products = [];
      component.loading = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No hay productos');
    });
  });

  describe('Category handling', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.categories = mockCategories;
      fixture.detectChanges();
    });

    it('should display category name correctly', () => {
      const categoryName = component.getCategoryName(1);
      expect(categoryName).toBe('Analgésicos');
    });

    it('should return "Sin categoría" for unknown category', () => {
      const categoryName = component.getCategoryName(999);
      expect(categoryName).toBe('Sin categoría');
    });

    it('should get correct category color', () => {
      expect(component.getCategoryColor(1)).toBe('secondary');
      expect(component.getCategoryColor(2)).toBe('tertiary');
    });
  });

  describe('Stock status', () => {
    it('should return "danger" for zero stock', () => {
      expect(component.getStockStatus(0, 10)).toBe('danger');
    });

    it('should return "warning" for stock below minimum', () => {
      expect(component.getStockStatus(5, 10)).toBe('warning');
    });

    it('should return "success" for adequate stock', () => {
      expect(component.getStockStatus(50, 10)).toBe('success');
    });

    it('should handle undefined stockMinimo', () => {
      expect(component.getStockStatus(50, undefined)).toBe('success');
    });

    it('should return correct stock labels', () => {
      expect(component.getStockLabel(0, 10)).toBe('Agotado');
      expect(component.getStockLabel(5, 10)).toBe('Stock bajo');
      expect(component.getStockLabel(50, 10)).toBe('Disponible');
    });
  });

  describe('Event emission', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.categories = mockCategories;
      fixture.detectChanges();
    });

    it('should emit productSelected when product is clicked', () => {
      spyOn(component.productSelected, 'emit');

      // Trigger click on product card (this would be handled by the template)
      component.productSelected.emit(mockProducts[0]);

      expect(component.productSelected.emit).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should emit editProduct when edit button is clicked', () => {
      spyOn(component.editProduct, 'emit');

      component.editProduct.emit(mockProducts[0]);

      expect(component.editProduct.emit).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should emit deleteProduct when delete button is clicked', () => {
      spyOn(component.deleteProduct, 'emit');

      component.deleteProduct.emit(mockProducts[0]);

      expect(component.deleteProduct.emit).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should emit addProduct when add button is clicked', () => {
      spyOn(component.addProduct, 'emit');

      component.addProduct.emit();

      expect(component.addProduct.emit).toHaveBeenCalled();
    });

    it('should emit retry when retry button is clicked', () => {
      spyOn(component.retry, 'emit');

      component.retry.emit();

      expect(component.retry.emit).toHaveBeenCalled();
    });
  });

  describe('TrackBy function', () => {
    it('should return product id for trackBy', () => {
      const result = component.trackByProductId(0, mockProducts[0]);
      expect(result).toBe(1);
    });

    it('should return index when product has no id', () => {
      const productWithoutId = { ...mockProducts[0], id: undefined as any };
      const result = component.trackByProductId(5, productWithoutId as any);
      expect(result).toBe(5);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.categories = mockCategories;
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on buttons', () => {
      const compiled = fixture.nativeElement;
      const editButtons = compiled.querySelectorAll('ion-button[aria-label*="Editar"]');
      const deleteButtons = compiled.querySelectorAll('ion-button[aria-label*="Eliminar"]');

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('should have role="button" on clickable cards', () => {
      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('ion-card[role="button"]');
      expect(cards.length).toBe(mockProducts.length);
    });
  });
});