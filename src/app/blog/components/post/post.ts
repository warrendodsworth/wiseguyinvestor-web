import { Component, computed, input } from '@angular/core';
import { DatePredicate } from '@core';

import { SHARED_CONFIG } from '../../../shared/shared.config';
import { Post } from '../../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  imports: [SHARED_CONFIG],
})
export class PostComponent {
  post = input<Post | undefined>();
  admin = input(false);

  readTime = computed(() => {
    const p = this.post();
    if (!p?.text) return 1;
    const plainText = p.text.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  });

  toDate(d: DatePredicate): Date {
    if (typeof d === 'string') return new Date(d);
    if (typeof (d as any).toDate === 'function') return (d as any).toDate();
    return new Date((d as any).seconds * 1000); // plain {seconds, nanoseconds} map
  }

  excerpt = computed(() => {
    const p = this.post();
    if (!p?.text) return '';
    return p.text
      .replace(/<[^>]*>/g, '')
      .slice(0, 160)
      .trim();
  });
}
