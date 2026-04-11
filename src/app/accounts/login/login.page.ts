import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { Analytics } from '@angular/fire/analytics';
import { logEvent } from 'firebase/analytics';
import { AuthService } from '@core';
import { ConfigService } from '@core';
import { UtilService } from '@core';
import { SHARED_FORMLY_CONFIG } from '../../shared/shared.config';
import { ACCOUNTS_ROUTES } from '../accounts.constants';

type View = 'login' | 'signup' | 'forgotPassword';

@Component({
  templateUrl: 'login.page.html',
  imports: [SHARED_FORMLY_CONFIG],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private analytics = inject(Analytics, { optional: true });
  protected authModular = inject(Auth);
  router = inject(Router);
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  util = inject(UtilService);
  config = inject(ConfigService);

  view = signal<View>('login');
  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model = { email: '', password: '', displayName: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'displayName',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Preferred name',
        required: true,
        hideRequiredMarker: true,
        inputmode: 'text',
        autocomplete: 'name',
        autocapitalize: 'words',
      },
      hideExpression: (model: any, formState: any) => formState.view != 'signup',
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        required: true,
        hideRequiredMarker: true,
        inputmode: 'email',
        autocomplete: 'email',
      },
      validators: { validation: ['email'] },
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        required: true,
        hideRequiredMarker: true,
        minLength: 6,
      },
      validators: {
        validation: [
          (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;
            return value.length >= 6 ? null : { minlength: { requiredLength: 6, actualLength: value.length } };
          },
        ],
      },
      hideExpression: (model: any, formState: any) => formState.view == 'forgotPassword',
      expressionProperties: {
        'templateOptions.autocomplete': (model: any, formState: any) =>
          formState.view == 'signup' ? 'new-password' : 'current-password',
      },
    },
  ];

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const v = (params.get('view') as View) || this.view();
      this.view.set(v);
      this.options.formState.view = v; // formly options formstate.view needed for consistent hide expr execution
      if (this.analytics) {
        logEvent(this.analytics, 'screen_view');
        logEvent(this.analytics, 'page_view', { page: v });
      }
    });
  }

  async loginEmail(model: any) {
    let detailLoading = null;
    let baseLoading = null;
    try {
      baseLoading = await this.util.openLoading('Please wait..');
      const cred = await signInWithEmailAndPassword(this.authModular, model.email, model.password);

      if (cred.user) {
        detailLoading = await this.util.openLoading('Logging you in..');
        baseLoading.close();

        await this.auth.updateUserData(cred);

        this.goReturnUrlOrHome();

        detailLoading.close();
      } else {
        baseLoading.close();
      }
    } catch (error: any) {
      baseLoading?.close();
      detailLoading?.close();
      this.util.openSnackbar(error?.message, '', 5000);
    }
  }

  async signupEmail(model: any) {
    const user = await this.auth.signupEmail(model);
    if (user) {
      this.goReturnUrlOrHome();
    }
  }

  async loginGoogle() {
    try {
      const cred = await this.auth.loginGoogle();
      if (cred) {
        await this.auth.updateUserData(cred);
        this.goReturnUrlOrHome();
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        this.util.openSnackbar(`Sorry there's been an issue.`, error?.message);
        console.error(`[login]`, error);
      }
    }
  }

  async loginApple() {
    try {
      const cred = await this.auth.loginApple();
      if (cred) {
        await this.auth.updateUserData(cred);
        this.goReturnUrlOrHome();
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        this.util.openSnackbar(`Sorry there's been an issue.`, error?.message);
        console.error(`[login]`, error);
      }
    }
  }

  async sendPasswordResetEmail(model: any) {
    try {
      await sendPasswordResetEmail(this.authModular, model?.email);
      this.util.openSnackbar('Password reset email sent');
    } catch (error: any) {
      if (error?.code == 'auth/user-not-found') {
        this.util.openSnackbar("Oops! We couldn't find a user with that email address", '', 3000);
      } else {
        this.util.openSnackbar(error?.message, '', 5000);
        throw error;
      }
    }
  }

  changeView(view: View) {
    this.form.reset();
    this.router.navigate(['.'], { queryParams: { view }, relativeTo: this.route, queryParamsHandling: 'merge' });
  }

  goWelcome(p: Params = {}) {
    return this.router.navigate([ACCOUNTS_ROUTES.welcome], {
      queryParams: { flow: 'signin', ...p },
      queryParamsHandling: 'merge',
    });
  }
  goChooseUserType() {
    return this.router.navigate([ACCOUNTS_ROUTES.chooseUserType], { queryParamsHandling: 'merge' });
  }
  goReturnUrlOrHome() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) this.router.navigateByUrl(returnUrl);
    else this.goHome();
  }
  goHome() {
    return this.router.navigateByUrl('/');
  }
}
