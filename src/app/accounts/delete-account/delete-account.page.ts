import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, UtilService } from '@core';
import { SHARED_CONFIG } from '../../shared/shared.config';
import { ACCOUNTS_ROUTES } from '../accounts.constants';

@Component({
  templateUrl: './delete-account.page.html',
  imports: [SHARED_CONFIG],
})
export class DeleteAccountPage {
  router = inject(Router);
  auth = inject(AuthService);
  util = inject(UtilService);

  async confirm() {
    const confirmed = await this.util.confirmDialog(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      'Delete'
    );
    if (!confirmed) return;

    const loading = await this.util.openLoading('Deleting account...');
    try {
      await this.auth.deleteAccount();
      loading.close();
      this.util.openSnackbar('Account deleted', 'Sorry to see you go!', 3000);
      await this.router.navigateByUrl('/');
    } catch (error: any) {
      loading.close();
      const errorCode = error?.code || '';
      const errorMsg = error?.message || 'An error occurred';

      if (errorCode === 'auth/requires-recent-login' || errorMsg.includes('requires-recent-login')) {
        this.util.openSnackbar('Please sign in again to delete your account', '', 4000);
        await this.router.navigate([ACCOUNTS_ROUTES.login], {
          queryParams: { returnUrl: ACCOUNTS_ROUTES.deleteAccount },
        });
      } else {
        this.util.openSnackbar(`Error: ${errorMsg}`, '', 5000);
      }
    }
  }

  cancel() {
    this.router.navigateByUrl(ACCOUNTS_ROUTES.edit);
  }
}
