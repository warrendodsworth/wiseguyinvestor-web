import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private auth = inject(Auth);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  canActivate(): Promise<boolean | UrlTree> {
    if (!this.isBrowser) {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user ? true : this.router.createUrlTree(['/accounts/login']));
      });
    });
  }
}
