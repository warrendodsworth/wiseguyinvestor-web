import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AppUser } from '../../core/models/user';
import { SHARED_CONFIG } from '../../shared/shared.config';

@Component({
  imports: [SHARED_CONFIG],
  template: `
    <div class="px-6 pt-3 bg-white dark:bg-gray-800 flex flex-row justify-between items-center">
      <span class="font-semibold text-base text-gray-900 dark:text-gray-100">{{ user.displayName }}</span>

      <a
        [routerLink]="['/accounts/users', user.uid, 'edit']"
        (click)="close()"
        class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <span class="material-symbols-rounded align-middle">edit</span>
      </a>
    </div>
    <mat-dialog-content class="bg-white dark:bg-gray-800 rounded-b-2xl">
      <div class="flex flex-col justify-stretch items-stretch gap-1">
        @if (currentUser.roles.admin) {
          <a
            [routerLink]="['/app/tabs/accounts', user.uid, 'requests']"
            (click)="close()"
            class="flex items-center justify-between gap-2 py-3 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span>Chat requests</span>
            <span class="material-symbols-rounded text-gray-400 text-lg">chevron_right</span>
          </a>
          <a
            [routerLink]="['/app/tabs/chats']"
            [queryParams]="{ uid: user.uid }"
            (click)="close()"
            class="flex items-center justify-between gap-2 py-3 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span>Chats</span>
            <span class="material-symbols-rounded text-gray-400 text-lg">chevron_right</span>
          </a>
        }

        @if (currentUser.roles.admin) {
          <a
            [routerLink]="['/app/tabs/accounts', user.uid, 'feedback']"
            (click)="close()"
            class="flex items-center justify-between gap-2 py-3 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span>Feedback received</span>
            <span class="material-symbols-rounded text-gray-400 text-lg">chevron_right</span>
          </a>

          <!-- <a
          [routerLink]="['/app/tabs/accounts', user.uid, 'membership']"
          (click)="close()"
          class="flex items-center gap-2 px-2 py-2 rounded text-gray-700 dark:text-gray-300"
        >
          <span class="material-symbols-rounded text-base">badge</span>
          <span>User's Groups</span>
        </a>
        <a
          [routerLink]="['/app/tabs/accounts', user.uid, 'issues']"
          (click)="close()"
          class="flex items-center gap-2 px-2 py-2 rounded text-gray-700 dark:text-gray-300"
        >
          <span class="material-symbols-rounded text-base">confirmation_number</span>
          <span>Issues reported</span>
        </a> -->
          <!-- <a
          [routerLink]="['/app/tabs/accounts', user.uid, 'block-list']"
          (click)="close()"
          class="flex items-center gap-2 px-2 py-2 rounded text-gray-700 dark:text-gray-300"
        >
          <span class="material-symbols-rounded text-base">person_remove</span>
          <span>Blocklist</span>
        </a>
        <a
          [routerLink]="['/app/tabs/accounts', user.uid, 'partnerships']"
          (click)="close()"
          class="flex items-center gap-2 px-2 py-2 rounded text-gray-700 dark:text-gray-300"
        >
          <span class="material-symbols-rounded text-base">storefront</span>
          <span>Partnerships</span>
        </a> -->
          <!-- <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'settings', 'mate-join']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded text-gray-700 dark:text-gray-300"
      >
        <span class="material-symbols-rounded text-base">person</span>
        <span>Mate in Training status</span>
      </a> -->
        }
      </div>
    </mat-dialog-content>
  `,
})
export class UsersAdminPopoverComponent implements OnInit {
  user: AppUser;
  currentUser: AppUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: AppUser; currentUser: AppUser },
    public dialogRef: MatDialogRef<UsersAdminPopoverComponent>
  ) {
    this.user = data.user;
    this.currentUser = data.currentUser;
  }

  ngOnInit() {}

  close(action: string = 'close') {
    this.dialogRef.close(action);
  }
}
