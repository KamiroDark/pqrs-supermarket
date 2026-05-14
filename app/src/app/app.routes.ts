import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'radicacion',
    loadComponent: () => import('./pages/radicacion/radicacion.page').then( m => m.RadicacionPage)
  },
  {
    path: 'listado',
    loadComponent: () => import('./pages/listado/listado.page').then( m => m.ListadoPage)
  },
];
