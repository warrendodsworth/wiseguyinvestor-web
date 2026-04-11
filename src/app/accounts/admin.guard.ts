import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { AppUser } from '@core';
import { AuthService } from '@core';
import { UtilService } from '@core';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  private auth = inject(AuthService);
  private util = inject(UtilService);
  private platformId = inject(PLATFORM_ID);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // No auth on the server — deny immediately so SSR doesn't hang
    if (isPlatformServer(this.platformId)) return false;

    return this.auth.currentUser$.pipe(
      filter((u) => !!u), // wait for initial auth to resolve
      take(1), // complete the Observable so the router can proceed
      map((user: AppUser) => {
        if (!user?.roles.admin) this.util.openSnackbar('Not authorized');
        return user && user.roles.admin ? true : false;
      })
    );
  }
}
