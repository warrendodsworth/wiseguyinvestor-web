import { Routes } from '@angular/router';
import { accountsRoutes } from './accounts/accounts.routes';
import { blogRoutes } from './blog/blog.routes';
import { homeRoutes } from './company/home.routes';

export const routes: Routes = [
  // ...homeRoutes,
  {
    path: '',
    children: homeRoutes,
  },
  {
    path: 'accounts',
    children: accountsRoutes,
  },
  {
    path: 'blog',
    children: blogRoutes,
  },

  // other routes
];
