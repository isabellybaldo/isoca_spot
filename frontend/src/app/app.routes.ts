import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'callback',
    loadComponent: () => import('./callback.component').then(m => m.CallbackComponent)
  }
];
