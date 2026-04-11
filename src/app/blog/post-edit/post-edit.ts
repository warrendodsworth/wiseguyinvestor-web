import { Component, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { PhotoService } from '@core/services';
import { SHARED_FORMLY_CONFIG } from '../../shared/shared.config';
import { UnsplashSearchComponent } from '../../shared/photos/unsplash-search/unsplash-search';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  templateUrl: './post-edit.html',
  imports: [SHARED_FORMLY_CONFIG],
})
export class PostEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  postService = inject(PostService);
  photoService = inject(PhotoService);

  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model: Post | undefined = new Post();
  working = signal(true);
  selectedFile: any;

  postFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-1',
      fieldGroup: [
        {
          key: 'photoURL',
          type: 'photo',
          className: 'mb-4',
          props: {
            className: 'w-full h-48 rounded-lg bg-gray-100',
            label: 'Photo',
            unsplashComponent: UnsplashSearchComponent,
            onFileSelected: (file: any) => (this.selectedFile = file),
          },
        },
        {
          key: 'title',
          type: 'input',
          props: { label: 'Title', placeholder: 'Add a title', required: true },
        },
        {
          key: 'text',
          type: 'rich-editor',
          className: 'mb-4',
          props: { label: 'Body', placeholder: 'Write your post here...' },
        },
        {
          key: 'videoURL',
          type: 'input',
          props: { label: 'Video Embed Url', placeholder: 'eg. youtube' },
        },
        {
          key: 'category',
          type: 'input',
          props: { label: 'Category', placeholder: 'Add a category' },
        },
        { key: 'draft', type: 'toggle', props: { label: 'Draft' } },
        { key: 'featured', type: 'toggle', props: { label: 'Featured' } },
      ],
    },
  ];

  constructor() {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      firstValueFrom(
        this.postService.one$(postId).pipe(
          tap((post) => (this.model = post)),
          finalize(() => this.working.set(false))
        )
      );
    } else {
      this.model = new Post();
      this.working.set(false);
    }
  }

  async save(model: Post | undefined) {
    if (!model) return;
    await this.postService.upsertPost(model, this.selectedFile);
    this.form.reset();
    this.router.navigate(['/blog/posts', model.id]);
  }
}
