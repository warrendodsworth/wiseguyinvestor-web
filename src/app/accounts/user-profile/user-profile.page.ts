import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ShowPhotoComponent } from '@core/ui';
import { AuthService, LayoutService, UtilService } from '@core';
import { SHARED_CONFIG } from '../../shared/shared.config';

@Component({
  templateUrl: './user-profile.page.html',
  imports: [SHARED_CONFIG, ShowPhotoComponent],
})
export class UserProfilePage {
  useTransparentToolbar = true;

  _layout = inject(LayoutService);
  util = inject(UtilService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);

  user = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const uid = params.get('uid');
        return uid ? this.auth.getUser$(uid) : this.auth.currentUser$;
      })
    )
  );

  canEdit = computed(() => {
    const user = this.user();
    const currentUser = this.auth.currentUser();
    if (!user || !currentUser) return false;
    return user.id === currentUser.id || currentUser.roles.admin;
  });
}
