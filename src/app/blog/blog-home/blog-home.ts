import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { where } from 'firebase/firestore';
import { AuthService } from '@core';
import { SHARED_CONFIG } from '../../shared/shared.config';
import { PostComponent } from '../components/post/post';
import { PostService } from '../post.service';

@Component({
  templateUrl: './blog-home.html',
  imports: [SHARED_CONFIG, PostComponent],
})
export class BlogHomePage {
  auth = inject(AuthService);
  private postService = inject(PostService);

  posts = toSignal(this.postService.many$(where('draft', '==', false)));
  featuredPost = computed(() => this.posts()?.find((x) => x.featured));
  recentPosts = computed(() =>
    this.posts()
      ?.filter((x) => !x.featured)
      .slice(0, 6)
  );
  featuredExcerpt = computed(() => {
    const p = this.featuredPost();
    if (!p?.text) return '';
    return p.text
      .replace(/<[^>]*>/g, '')
      .slice(0, 220)
      .trim();
  });
}
