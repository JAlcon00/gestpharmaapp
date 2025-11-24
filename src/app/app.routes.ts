import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'pos',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/pos/pos.page').then(m => m.PosPage),
          },
          {
            path: 'checkout',
            loadComponent: () => import('./modules/pos/checkout/checkout.page').then(m => m.CheckoutPage),
          },
        ],
      },
      {
        path: 'inventory',
        loadComponent: () => import('./modules/inventory/inventory.page').then(m => m.InventoryPage),
      },
      {
        path: 'reports',
        loadComponent: () => import('./modules/reports/reports.page').then(m => m.ReportsPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/pages/unauthorized/unauthorized.page').then(m => m.UnauthorizedPage),
  },
];
