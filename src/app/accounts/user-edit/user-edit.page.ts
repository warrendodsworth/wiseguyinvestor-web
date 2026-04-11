import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AppUser, Roles } from '@core/models';
import { AuthService, UtilService } from '@core/services';
import { displayNameField, profilePhotoField, emailReadOnlyField } from '@core/ui';
import { SHARED_FORMLY_CONFIG } from '../../shared/shared.config';
import { ACCOUNTS_ROUTES } from '../accounts.constants';

@Component({
  templateUrl: './user-edit.page.html',
  imports: [SHARED_FORMLY_CONFIG],
})
export class UserEditPage implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  util = inject(UtilService);
  cdRef = inject(ChangeDetectorRef);

  constructor() {}

  hasPasswordProvider = computed(
    () => this.auth.authModular.currentUser?.providerData.some((p) => p.providerId === 'password') ?? true
  );

  selectedSegment: string | undefined;

  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model: AppUser | any = null;

  userFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-1',
      fieldGroup: [
        profilePhotoField,

        { type: 'list-header', props: { label: 'Profile' } },
        displayNameField,
        emailReadOnlyField,

        {
          key: 'bio',
          type: 'textarea',
          props: {
            label: 'Bio',
            placeholder: 'Tell us a bit about yourself',
            rows: 6,
            autoGrow: true,
            autocapitalize: 'sentences',
          },
        },
        {
          key: 'address',
          type: 'input',
          props: {
            label: 'Town/City',
            labelPosition: 'stacked',
            autocapitalize: 'words',
            placeholder: 'e.g. Carlton, Melbourne',
          },
        },

        // userInterestsField,
        // userJoinReasonField,
        { type: 'list-header', props: { label: 'Privacy', bold: true } },
        {
          key: 'privacy',
          fieldGroup: [
            {
              type: 'list-text',
              className: 'text-wrap',
              props: { label: `Choose the information you want to share with your Mate` },
            },
            {
              key: 'userInterestsPublic',
              type: 'toggle',
              props: { label: `Interests`, disabled: this.model?.roles?.admin },
              // disabled doesn't work as expected though model roles is set when changed
            },
            {
              key: 'userJoinReasonPublic',
              type: 'toggle',
              props: { label: `Reason for Joining`, defaultValue: true },
            },
          ],
        },
      ],
    },
  ];
  adminFields: FormlyFieldConfig[] = [
    {
      hideExpression: '!formState.admin',
      fieldGroup: [
        { type: 'list-header', props: { label: 'For Admins', className: 'mb-3' } },
        {
          key: 'roles',
          type: 'multicheckbox',
          props: {
            label: 'Roles',
            options: Object.entries(new Roles()).map((r) => ({ label: r[0], value: r[0] })),
          },
        },
      ],
    },
  ];

  async ngOnInit() {
    this.selectedSegment = this.route.snapshot.queryParamMap.get('selectedSegment') || 'edit';

    // load uid and current user
    const uid = this.route.snapshot.paramMap.get('uid');
    const currentUser = await this.auth.getCurrentUser();

    // for admins to change email
    let email: string | null | undefined;
    if (currentUser?.roles.admin && uid) {
      const meta = await this.auth.getUserMeta(uid);
      email = meta?.email;
    } else {
      email = (await this.auth.authModular.currentUser)?.email;
    }

    // load user data
    this.model = uid ? await this.auth.getUser(uid) : currentUser;
    this.model.email = email;
    this.model.mateJoin = this.model.mateJoin || {};
    if (!this.model.photoURL) {
      this.model.photoURL = this.util.env['gravatarURL'];
    }
    // console.table(`UserEditPage model:`, this.model);
    // this.model.mate = this.model.mate || {}; // temp until data migrated

    this.options.formState.mainModel = { ...this.model };
    this.options.formState.admin = currentUser?.roles?.admin ?? false;
    this.cdRef.detectChanges();
  }

  async save(user: AppUser) {
    const updatedUser = await this.auth.updateUser(user, {}, true);
    const currentUser = await this.auth.authModular.currentUser;
    // this.location.back(); // original choice

    if (this.options.formState.admin && currentUser?.uid != updatedUser?.uid) {
      this.router.navigate(['/accounts/users']);
    } else {
      this.router.navigate(['/accounts/profile']);
    }
  }

  // Designed for tabs of Profile and Edit
  togglePreview(value: string) {
    this.router.navigate(['.'], { queryParams: { selectedSegment: value }, relativeTo: this.route });
  }

  readonly routes = ACCOUNTS_ROUTES;
}

// doesn't fire - because Formly’s change hook on a field does not listen to programmatic value changes
// change: (field: FormlyFieldConfig, event: any) => {
// // activate mate when verifying
// field.model.mateActive = event.detail.checked;
// // set interests public when verifying (force)
// Field doesn't exist when shown odd though hideExpr says do the opposite
// if (event.detail.checked) {
//   field.form.get('userInterestsPublic').setValue(event.detail.checked);
// }
// // add basic bio when verifying
// if (event.detail.checked) {
//   const bio = field.form.get('bio');
//   if (bio && !bio.value) {
//     bio.patchValue(`Hi, I'm ${field.model.displayName?.split(' ')[0]}. Nice to meet you.`);
//   }
// }
// },

// {
//   key: 'subscriptions',
//   type: 'multicheckbox',
//   templateOptions: {
//     label: 'Subscriptions',
//     options: Object.entries(new Subscriptions()).map(r => ({ label: r[0], value: r[0] })),
//   },
// },

// https://stackoverflow.com/questions/46101246/expressionchangedafterithasbeencheckederror-when-add-validator-in-ngoninit

//const tags = await this._tag.getActiveTags(TagCategory.Support);
// const supportAreas = findField('supportAreas', { fieldGroup: this.mateFields });
// if (supportAreas) {
//   supportAreas.templateOptions.options = tags.map((t) => ({ label: t.name, value: t.name }));
// }
