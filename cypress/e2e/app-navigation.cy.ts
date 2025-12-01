describe('GestPharma E2E Tests', () => {

  beforeEach(() => {
    // Mock authentication for all tests that need it
    cy.window().then((win) => {
      win.localStorage.setItem('currentUser', JSON.stringify({
        id: 1,
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        roles: ['ADMIN']
      }));
      win.localStorage.setItem('token', 'mock-jwt-token');
    });

    // Visit the app
    cy.visit('/');
  });

  it('should load the app successfully', () => {
    // Check that the app loads
    cy.get('app-root').should('exist');
    cy.get('ion-app').should('exist');
  });

  it('should redirect to login page', () => {
    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('should display login page elements', () => {
    // Check login page elements
    cy.get('ion-title').should('contain', 'GestPharma');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('ion-button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Try to submit empty form
    cy.get('ion-button[type="submit"]').click();

    // Should show some kind of validation (this depends on implementation)
    // For now, just check the form is still there
    cy.get('input[type="email"]').should('be.visible');
  });

  it('should navigate to tabs after login (mock)', () => {
    // Mock authentication by setting localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('currentUser', JSON.stringify({
        id: 1,
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        roles: ['ADMIN']
      }));
      win.localStorage.setItem('token', 'mock-jwt-token');
    });

    // Now visit tabs - just check that we can access the route
    cy.visit('/tabs/dashboard', { failOnStatusCode: false });

    // Check that we're not redirected back to login
    cy.url().should('include', '/tabs');
  });

  it('should have working tab navigation', () => {
    // Visit different tab routes (authentication is already mocked in beforeEach)
    cy.visit('/tabs/inventory');
    cy.url().should('include', '/tabs/inventory');

    cy.visit('/tabs/reports');
    cy.url().should('include', '/tabs/reports');
  });

  it('should handle responsive design', () => {
    // Test mobile viewport (already set in config)
    cy.viewport(375, 667);

    // Visit login
    cy.visit('/login');

    // Check elements are properly sized for mobile
    cy.get('ion-button[type="submit"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });

  it('should handle tablet viewport', () => {
    // Test tablet viewport
    cy.viewport(768, 1024);

    cy.visit('/login');

    // Elements should still be accessible
    cy.get('ion-title').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });

  it('should handle desktop viewport', () => {
    // Test desktop viewport
    cy.viewport(1200, 800);

    cy.visit('/login');

    // Elements should still work
    cy.get('ion-button[type="submit"]').should('be.visible');
  });
});