import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { UtilService } from '@core';
import { FirebaseAuthService } from '@core/firebase';
import { SHARED_FORMLY_CONFIG } from '../../shared/shared.config';
import { ACCOUNTS_ROUTES } from '../accounts.constants';

@Component({
  templateUrl: './change-email.page.html',
  imports: [SHARED_FORMLY_CONFIG],
})
export class ChangeEmailPage implements OnInit {
  router = inject(Router);
  auth = inject(FirebaseAuthService);
  util = inject(UtilService);

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: { email: string; currentPassword: string } = { email: '', currentPassword: '' };
  needsPasswordReauth = false;

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'New email address',
        placeholder: 'Enter new email',
        required: true,
        autocomplete: 'email',
        inputmode: 'email',
      },
      validators: { validation: ['email'] },
    },
    {
      key: 'currentPassword',
      type: 'input',
      props: {
        type: 'password',
        label: 'Current password',
        placeholder: 'Enter your current password to confirm',
        required: true,
        autocomplete: 'current-password',
      },
      expressions: {
        hide: () => !this.needsPasswordReauth,
        'props.required': () => this.needsPasswordReauth,
      },
    },
  ];

  async ngOnInit() {
    const currentUser = this.auth.authModular.currentUser;
    this.model = { email: currentUser?.email || '', currentPassword: '' };
  }

  async submit(model: { email: string; currentPassword: string }) {
    if (!model.email) return;

    const loading = await this.util.openLoading('Updating email...');
    try {
      if (this.needsPasswordReauth) {
        await this.auth.reauthenticateWithPassword(model.currentPassword);
        this.needsPasswordReauth = false;
      }

      await this.auth.changeEmail(model.email);
      loading.close();
      this.util.openSnackbar(
        `Verification email sent to ${model.email}. Click the link to confirm your new address.`,
        '',
        6000
      );
      await this.router.navigateByUrl(ACCOUNTS_ROUTES.profile);
    } catch (error: any) {
      loading.close();
      const errorCode = error?.code || '';

      if (errorCode === 'auth/requires-recent-login') {
        if (this.auth.hasPasswordProvider()) {
          this.needsPasswordReauth = true;
          this.util.openSnackbar('Enter your current password to confirm', '', 4000);
        } else {
          // Google (or other OAuth) user — reauthenticate via popup then retry
          try {
            const reauthing = await this.util.openLoading('Verifying with Google...');
            await this.auth.reauthenticateGoogle();
            reauthing.close();
            this.submit(model);
          } catch (reAuthError: any) {
            this.util.openSnackbar(reAuthError?.message || 'Re-authentication failed', '', 5000);
          }
        }
      } else {
        this.util.openSnackbar(error?.message || 'An error occurred', '', 5000);
      }
    }
  }
}
