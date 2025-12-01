import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { InventoryPage } from './inventory.page';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../core/models';

describe('InventoryPage Integration', () => {
  let component: InventoryPage;
  let fixture: ComponentFixture<InventoryPage>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      nombre: 'Paracetamol',
      precio: 25.50,
      stock: 100,
      categoriaId: 1,
      activo: true
    },
    {
      id: 2,
      nombre: 'Ibuprofeno',
      precio: 35.00,
      stock: 50,
      categoriaId: 1,
      activo: true
    }
  ];

  const mockCategories: Category[] = [
    { id: 1, nombre: 'Analgésicos', activo: true },
    { id: 2, nombre: 'Antibióticos', activo: true }
  ];

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', ['getAll', 'getByCategory', 'search', 'create', 'update', 'delete']);
    const categorySpy = jasmine.createSpyObj('CategoryService', ['getAll', 'create', 'update', 'delete']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        InventoryPage
      ],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: CategoryService, useValue: categorySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryPage);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryServiceSpy = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load categories and products on init', () => {
      // Setup spies
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));

      // Initialize component
      fixture.detectChanges();

      // Verify services were called
      expect(categoryServiceSpy.getAll).toHaveBeenCalled();
      expect(productServiceSpy.getAll).toHaveBeenCalled();

      // Verify data was loaded
      expect(component.categories).toEqual(mockCategories);
      expect(component.products).toEqual(mockProducts);
    });

    it('should handle category loading error gracefully', () => {
      categoryServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));

      fixture.detectChanges();

      expect(component.categories).toEqual([]);
      expect(component.products).toEqual(mockProducts);
    });

    it('should handle product loading error gracefully', () => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

      fixture.detectChanges();

      expect(component.categories).toEqual(mockCategories);
      expect(component.products).toEqual([]);
      expect(component.error).toBe('Error al cargar productos');
    });
  });

  describe('Product Management', () => {
    beforeEach(() => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should create product successfully', () => {
      const newProduct = {
        nombre: 'Aspirina',
        precio: 15.00,
        stock: 75,
        categoriaId: 1
      };

      productServiceSpy.create.and.returnValue(of({ id: 3, ...newProduct, activo: true }));

      // Simulate form submission (this would normally come from a modal)
      component.createProduct(newProduct);

      expect(productServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining(newProduct));
      expect(component.products.length).toBe(3); // Original 2 + new 1
    });

    it('should update product successfully', () => {
      const updatedProduct = {
        nombre: 'Paracetamol Updated',
        precio: 30.00,
        categoriaId: 1
      };

      productServiceSpy.update.and.returnValue(of({ ...mockProducts[0], ...updatedProduct }));

      component.updateProduct(1, updatedProduct);

      expect(productServiceSpy.update).toHaveBeenCalledWith(1, jasmine.objectContaining(updatedProduct));
      expect(component.products[0].nombre).toBe('Paracetamol Updated');
    });

    it('should delete product successfully', () => {
      productServiceSpy.delete.and.returnValue(of(undefined));

      spyOn(component, 'showToast'); // Mock toast to avoid DOM dependencies

      component.deleteProduct(mockProducts[0]);

      expect(productServiceSpy.delete).toHaveBeenCalledWith(1);
      expect(component.products.length).toBe(1); // Original 2 - 1 deleted
    });
  });

  describe('Category Management', () => {
    beforeEach(() => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should create category successfully', () => {
      const newCategory = {
        nombre: 'Vitaminas',
        descripcion: 'Suplementos vitamínicos'
      };

      categoryServiceSpy.create.and.returnValue(of({ id: 3, ...newCategory, activo: true }));

      component.createCategory(newCategory);

      expect(categoryServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining(newCategory));
      expect(component.categories.length).toBe(3);
    });

    it('should update category successfully', () => {
      const updatedCategory = {
        nombre: 'Analgésicos Updated',
        descripcion: 'Medicamentos para el dolor'
      };

      categoryServiceSpy.update.and.returnValue(of({ ...mockCategories[0], ...updatedCategory }));

      component.updateCategory(1, updatedCategory);

      expect(categoryServiceSpy.update).toHaveBeenCalledWith(1, jasmine.objectContaining(updatedCategory));
      expect(component.categories[0].nombre).toBe('Analgésicos Updated');
    });

    it('should delete category successfully', () => {
      categoryServiceSpy.delete.and.returnValue(of(undefined));

      spyOn(component, 'showToast');

      component.deleteCategory(mockCategories[0]);

      expect(categoryServiceSpy.delete).toHaveBeenCalledWith(1);
      expect(component.categories.length).toBe(1);
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(() => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));
      productServiceSpy.getByCategory.and.returnValue(of(mockProducts)); // Both products are in category 1
      fixture.detectChanges();
    });

    it('should filter products by search term', () => {
      component.onSearchChange({ detail: { value: 'para' } });

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].nombre).toBe('Paracetamol');
    });

    it('should filter products by category', () => {
      component.onCategoryChange({ detail: { value: '1' } });

      expect(component.filteredProducts.length).toBe(2); // Both products are in category 1
    });

    it('should combine search and category filters', () => {
      component.onSearchChange({ detail: { value: 'ibu' } });
      component.onCategoryChange({ detail: { value: '1' } });

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].nombre).toBe('Ibuprofeno');
    });
  });

  describe('UI State Management', () => {
    beforeEach(() => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should switch between products and categories view', () => {
      expect(component.selectedView).toBe('products');

      component.onSegmentChange({ detail: { value: 'categories' } });
      expect(component.selectedView).toBe('categories');

      component.onSegmentChange({ detail: { value: 'products' } });
      expect(component.selectedView).toBe('products');
    });

    it('should calculate product count by category correctly', () => {
      const countMap = component.productCountByCategory;
      expect(countMap.get(1)).toBe(2); // Both products are in category 1
      expect(countMap.get(2)).toBeUndefined(); // No products in category 2
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      productServiceSpy.getAll.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should handle product selection', () => {
      spyOn(console, 'log'); // Mock console.log to avoid output
      component.onProductSelected(mockProducts[0]);
      expect(console.log).toHaveBeenCalledWith('Producto seleccionado:', mockProducts[0]);
    });

    it('should handle edit product request', () => {
      spyOn(component, 'showProductForm');
      component.onEditProduct(mockProducts[0]);
      expect(component.showProductForm).toHaveBeenCalledWith(1, 'edit', mockProducts[0]);
    });

    it('should handle delete product request', () => {
      spyOn(component, 'deleteProduct');
      component.onDeleteProduct(mockProducts[0]);
      expect(component.deleteProduct).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should handle add product request', () => {
      spyOn(component, 'addProduct');
      component.onAddProduct();
      expect(component.addProduct).toHaveBeenCalled();
    });

    it('should handle retry load request', () => {
      spyOn(component, 'loadProducts');
      component.onRetryLoad();
      expect(component.loadProducts).toHaveBeenCalled();
    });
  });
});