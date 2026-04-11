import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-formly-field-rich-editor',
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  template: `
    <div class="flex flex-col gap-1 w-full mb-2">
      @if (props.label) {
        <label [for]="props['id'] ?? id" class="text-base font-medium text-gray-900 dark:text-gray-100">
          {{ props.label }}
        </label>
      }
      <div
        class="rounded-lg overflow-hidden border transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50"
        [class.border-gray-300]="!(formControl.invalid && formControl.touched)"
        [class.dark:border-gray-600]="!(formControl.invalid && formControl.touched)"
        [class.border-red-500]="formControl.invalid && formControl.touched"
      >
        <quill-editor
          [formControl]="$any(formControl)"
          [modules]="props['modules']"
          [placeholder]="props.placeholder ?? ''"
          [readOnly]="props.readonly ?? false"
          [sanitize]="true"
          [id]="props['id'] ?? id"
        ></quill-editor>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host ::ng-deep .ql-toolbar {
        border: none;
        border-bottom: 1px solid #d1d5db;
        background: #f9fafb;
        border-radius: 0;
      }
      :host ::ng-deep .ql-container {
        border: none;
        font-family: inherit;
        font-size: 1rem;
      }
      :host ::ng-deep .ql-editor {
        min-height: 200px;
        color: #111827;
        background: #fff;
        padding: 0.75rem 1rem;
      }
      :host ::ng-deep .ql-editor.ql-blank::before {
        color: #6b7280;
        font-style: normal;
      }

      /* Dark mode */
      :host-context(.dark) ::ng-deep .ql-toolbar {
        border-bottom-color: #374151;
        background: #1f2937;
      }
      :host-context(.dark) ::ng-deep .ql-toolbar .ql-stroke {
        stroke: #d1d5db;
      }
      :host-context(.dark) ::ng-deep .ql-toolbar .ql-fill {
        fill: #d1d5db;
      }
      :host-context(.dark) ::ng-deep .ql-toolbar .ql-picker-label {
        color: #d1d5db;
      }
      :host-context(.dark) ::ng-deep .ql-editor {
        color: #f3f4f6;
        background: #111827;
      }
      :host-context(.dark) ::ng-deep .ql-editor.ql-blank::before {
        color: #6b7280;
      }
    `,
  ],
})
export class FormlyFieldRichEditor extends FieldType {}
