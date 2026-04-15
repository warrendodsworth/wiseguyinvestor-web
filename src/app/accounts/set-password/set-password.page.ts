import { Component, inject } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthService, UtilService } from '@core';
import { SHARED_FORMLY_CONFIG } from '../../shared/shared.config';
import { ACCOUNTS_ROUTES } from '../accounts.constants';

@Component({
  templateUrl: './set-password.page.html',
  imports: [SHARED_FORMLY_CONFIG],
})
export class SetPasswordPage {
  router = inject(Router);
  auth = inject(AuthService);
  util = inject(UtilService);

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = { password: '', confirmPassword: '' };

  fields: FormlyFieldConfig[] = [
    {
      key: 'password',
      type: 'input',
      props: {
        type: 'password',
        label: 'New password',
        required: true,
        autocomplete: 'new-password',
        minLength: 6,
      },
      validators: {
        validation: [
          (control: AbstractControl): ValidationErrors | null => {
            const v = control.value;
            if (!v) return null;
            return v.length >= 6 ? null : { minlength: { requiredLength: 6, actualLength: v.length } };
          },
        ],
      },
    },
    {
      key: 'confirmPassword',
      type: 'input',
      props: {
        type: 'password',
        label: 'Confirm password',
        required: true,
        autocomplete: 'new-password',
      },
      validators: {
        passwordMatch: {
          expression: (control: AbstractControl) => control.value === this.model.password,
          message: 'Passwords do not match',
        },
      },
    },
  ];

  async submit(model: { password: string; confirmPassword: string }) {
    if (!model.password || model.password !== model.confirmPassword) return;

    const loading = await this.util.openLoading('Setting password...');
    try {
      await this.auth.setPassword(model.password);
      loading.close();
      this.util.openSnackbar('Password set. You can now sign in with email and password.', '', 4000);
      await this.router.navigateByUrl(ACCOUNTS_ROUTES.edit);
    } catch (error: any) {
      loading.close();
      this.util.openSnackbar(error?.message || 'An error occurred', '', 5000);
    }
  }
}
