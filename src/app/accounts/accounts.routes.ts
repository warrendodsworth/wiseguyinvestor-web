import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { UserEditPage } from './user-edit/user-edit.page';
import { UserProfilePage } from './user-profile/user-profile.page';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';

export { ACCOUNTS_ROUTES } from './accounts.constants';

export const accountsRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginPage,
    title: 'Login',
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: UserProfilePage,
    title: 'Profile',
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    component: UserEditPage,
    title: 'Edit Profile',
  },
  {
    path: 'change-email',
    canActivate: [AuthGuard],
    loadComponent: () => import('./change-email/change-email.page').then((m) => m.ChangeEmailPage),
    title: 'Change Email',
  },
  {
    path: 'delete-account',
    canActivate: [AuthGuard],
    loadComponent: () => import('./delete-account/delete-account.page').then((m) => m.DeleteAccountPage),
    title: 'Delete Account',
  },
  {
    path: 'set-password',
    canActivate: [AuthGuard],
    loadComponent: () => import('./set-password/set-password.page').then((m) => m.SetPasswordPage),
    title: 'Set Password',
  },
  {
    path: 'users',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./user-list/user-list').then((m) => m.UserList),
        title: 'User List',
      },
      {
        path: ':uid',
        loadComponent: () => import('./user-profile/user-profile.page').then((m) => m.UserProfilePage),
        title: 'User Profile',
      },
      {
        path: ':uid/edit',
        loadComponent: () => import('./user-edit/user-edit.page').then((m) => m.UserEditPage),
        title: 'Edit User',
      },
    ],
  },
];
