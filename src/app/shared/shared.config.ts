import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MaterialModule } from '../../../libs/core/material.config';
import { CORE_PIPES } from '../../../libs/core/core.pipes';
import { EmptyListComponent } from '../../../libs/core/components/empty-list.component';
import { SkeletonTextComponent } from '../../../libs/core/components/skeleton-text.component';
import { SpinnerComponent } from '../../../libs/core/components/spinner.component';
import { CardSkeletonComponent } from '../../../libs/core/components/card-skeleton.component';

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
