import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  CardSkeletonComponent,
  CORE_PIPES,
  EmptyListComponent,
  MaterialModule,
  SkeletonTextComponent,
  SpinnerComponent,
} from '@core/ui';

const standaloneComponents = [EmptyListComponent, SkeletonTextComponent, SpinnerComponent, CardSkeletonComponent];

export const SHARED_CONFIG = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  NgPipesModule,
  MaterialModule,
  ...standaloneComponents,
  ...CORE_PIPES,
];

// Use in components that render <formly-form>
export const SHARED_FORMLY_CONFIG = [...SHARED_CONFIG, FormlyModule, FormlyMaterialModule];
