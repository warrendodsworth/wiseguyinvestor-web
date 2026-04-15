import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { orderBy } from '@angular/fire/firestore';
import { AuthService } from '@core';
import { SHARED_CONFIG } from '../../shared/shared.config';
import { PostService } from '../post.service';

@Component({
  templateUrl: './post-list.html',
  imports: [SHARED_CONFIG],
})
export class PostsComponent {
  router = inject(Router);
  auth = inject(AuthService);
  postService = inject(PostService);

  posts = toSignal(this.postService.many$(orderBy('createDate', 'desc')));

  async deletePost(postId: string) {
    await this.postService.deletePost(postId);
  }
}
