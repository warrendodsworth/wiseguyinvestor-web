import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Photo } from '@core/models';
import { SHARED_CONFIG } from '../../shared.config';
import { UnsplashPhoto } from './unsplash-response';
import { UnsplashService } from './unsplash.service';

@Component({
  selector: 'app-unsplash-search',
  templateUrl: './unsplash-search.html',
  imports: [SHARED_CONFIG],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsplashSearchComponent {
  private _unsplash = inject(UnsplashService);
  private dialogRef = inject(MatDialogRef<UnsplashSearchComponent>);
  data = inject(MAT_DIALOG_DATA);

  term = signal('');
  photos = signal<UnsplashPhoto[]>([]);
  working = signal(false);
  view = signal<'grid' | 'list'>('grid');

  private _debounce: any;

  constructor() {
    this.dialogRef.updateSize('600px', '520px');
  }

  onInput(value: string) {
    this.term.set(value);
    clearTimeout(this._debounce);
    if (!value.trim()) {
      this.photos.set([]);
      return;
    }
    this._debounce = setTimeout(() => this.search(value), 400);
  }

  async search(term: string) {
    this.working.set(true);
    try {
      const results = await firstValueFrom(this._unsplash.getPhotos(term));
      this.photos.set(results ?? []);
    } finally {
      this.working.set(false);
    }
  }

  select(photo: UnsplashPhoto) {
    this._unsplash.notifyUnsplashOfDownload(photo);
    this.dialogRef.close(new Photo(photo.urls.regular, photo.urls.small));
  }
}
