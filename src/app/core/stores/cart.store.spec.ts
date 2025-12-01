import { TestBed } from '@angular/core/testing';
import { CartStore, CartItem } from './cart.store';
import { Product } from '../models';

describe('CartStore', () => {
  let store: CartStore;
  let mockProduct: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore]
    });

    store = TestBed.inject(CartStore);
    mockProduct = {
      id: 1,
      nombre: 'Test Product',
      precio: 25.50,
      stock: 100,
      categoriaId: 1,
      activo: true
    };
  });

  afterEach(() => {
    // Limpiar estado entre tests
    store.clear();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty items initially', (done) => {
      store.items$.subscribe(items => {
        expect(items).toEqual([]);
        done();
      });
    });

    it('should have zero total initially', (done) => {
      store.total$.subscribe(total => {
        expect(total).toBe(0);
        done();
      });
    });

    it('should have zero item count initially', (done) => {
      store.itemCount$.subscribe(count => {
        expect(count).toBe(0);
        done();
      });
    });

    it('should be empty initially', (done) => {
      store.isEmpty$.subscribe(isEmpty => {
        expect(isEmpty).toBe(true);
        done();
      });
    });
  });

  describe('addItem()', () => {
    it('should add item to cart', (done) => {
      store.addItem(mockProduct, 2);

      store.items$.subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].product.id).toBe(mockProduct.id);
        expect(items[0].quantity).toBe(2);
        expect(items[0].subtotal).toBe(51); // 25.50 * 2
        done();
      });
    });

    it('should update quantity when adding existing item', (done) => {
      store.addItem(mockProduct, 2);
      store.addItem(mockProduct, 3);

      store.items$.subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(5);
        expect(items[0].subtotal).toBe(127.5); // 25.50 * 5
        done();
      });
    });

    it('should update total when adding item', (done) => {
      store.addItem(mockProduct, 2);

      store.total$.subscribe(total => {
        expect(total).toBe(51);
        done();
      });
    });

    it('should update item count when adding item', (done) => {
      store.addItem(mockProduct, 2);

      store.itemCount$.subscribe(count => {
        expect(count).toBe(2);
        done();
      });
    });

    it('should set isEmpty to false when adding item', (done) => {
      store.addItem(mockProduct, 1);

      store.isEmpty$.subscribe(isEmpty => {
        expect(isEmpty).toBe(false);
        done();
      });
    });
  });

  describe('updateQuantity()', () => {
    beforeEach(() => {
      store.addItem(mockProduct, 2);
    });

    it('should update item quantity', (done) => {
      store.updateQuantity(mockProduct.id, 5);

      store.items$.subscribe(items => {
        expect(items[0].quantity).toBe(5);
        expect(items[0].subtotal).toBe(127.5);
        done();
      });
    });

    it('should remove item if quantity is 0', (done) => {
      store.updateQuantity(mockProduct.id, 0);

      store.items$.subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });

    it('should remove item if quantity is negative', (done) => {
      store.updateQuantity(mockProduct.id, -1);

      store.items$.subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });
  });

  describe('removeItem()', () => {
    beforeEach(() => {
      store.addItem(mockProduct, 2);
    });

    it('should remove item from cart', (done) => {
      store.removeItem(mockProduct.id);

      store.items$.subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });

    it('should update total after removal', (done) => {
      store.removeItem(mockProduct.id);

      store.total$.subscribe(total => {
        expect(total).toBe(0);
        done();
      });
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      store.addItem(mockProduct, 2);
    });

    it('should clear all items', (done) => {
      store.clear();

      store.items$.subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });

    it('should reset total', (done) => {
      store.clear();

      store.total$.subscribe(total => {
        expect(total).toBe(0);
        done();
      });
    });
  });

  describe('Persistence', () => {
    beforeEach(() => {
      // Limpiar localStorage
      localStorage.removeItem('cart');
    });

    it('should save to localStorage when adding item', () => {
      store.addItem(mockProduct, 2);

      const stored = localStorage.getItem('cart');
      expect(stored).toBeTruthy();

      const items = JSON.parse(stored!);
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('should load from localStorage on init', (done) => {
      const savedItems: CartItem[] = [{
        product: mockProduct,
        quantity: 3,
        subtotal: 76.5
      }];
      localStorage.setItem('cart', JSON.stringify(savedItems));

      // Crear nueva instancia (simula reload)
      const newStore = new CartStore();

      newStore.items$.subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(3);
        done();
      });
    });
  });

  describe('Multiple products', () => {
    let product2: Product;

    beforeEach(() => {
      product2 = {
        ...mockProduct,
        id: 2,
        nombre: 'Ibuprofeno 400mg',
        precio: 35.00
      };
    });

    it('should handle multiple different products', (done) => {
      store.addItem(mockProduct, 2);
      store.addItem(product2, 1);

      store.items$.subscribe(items => {
        expect(items.length).toBe(2);
        done();
      });
    });

    it('should calculate total for multiple products', (done) => {
      store.addItem(mockProduct, 2); // 51
      store.addItem(product2, 1);    // 35

      store.total$.subscribe(total => {
        expect(total).toBe(86); // 51 + 35
        done();
      });
    });

    it('should calculate item count for multiple products', (done) => {
      store.addItem(mockProduct, 2);
      store.addItem(product2, 3);

      store.itemCount$.subscribe(count => {
        expect(count).toBe(5); // 2 + 3
        done();
      });
    });
  });
});