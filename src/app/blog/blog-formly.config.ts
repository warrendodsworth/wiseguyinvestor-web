import { ConfigOption, provideFormlyConfig } from '@ngx-formly/core';
import { provideQuillConfig } from 'ngx-quill';
import { FormlyFieldRichEditor } from './rich-editor.type';

export const BLOG_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'rich-editor',
      component: FormlyFieldRichEditor,
    },
  ],
};

export const blogFormlyProviders = [
  provideFormlyConfig(BLOG_FORMLY_CONFIG),
  provideQuillConfig({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'code-block'],
        ['clean'],
      ],
    },
  }),
];
