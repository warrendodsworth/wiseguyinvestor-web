import { Routes } from '@angular/router';

import { SkeletonTextComponent } from '@core';
import { AdminGuard } from '../accounts/admin.guard';
import { PostComponent } from './components/post/post';
import { blogFormlyProviders } from './blog-formly.config';

export const blogRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog-home/blog-home').then((m) => m.BlogHomePage),
    title: 'Blog',
  },
  {
    path: 'posts',
    children: [
      {
        path: '',
        loadComponent: () => import('./post-list/post-list').then((m) => m.PostsComponent),
        canActivate: [AdminGuard],
        title: 'All Posts',
      },
      {
        path: 'create',
        loadComponent: () => import('./post-edit/post-edit').then((m) => m.PostEditComponent),
        canActivate: [AdminGuard],
        providers: blogFormlyProviders,
        title: 'Create Post',
      },
      {
        path: ':postId',
        loadComponent: () => import('./post-detail/post-detail').then((m) => m.PostDetailComponent),
        title: 'Post Details',
      },
      {
        path: ':postId/edit',
        loadComponent: () => import('./post-edit/post-edit').then((m) => m.PostEditComponent),
        canActivate: [AdminGuard],
        providers: blogFormlyProviders,
        title: 'Edit Post',
      },
    ],
  },
];

export const blogCommonImports = [
  // standalone components
  SkeletonTextComponent,
  PostComponent,
];
