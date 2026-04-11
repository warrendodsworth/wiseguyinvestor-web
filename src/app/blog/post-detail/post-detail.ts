import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { SHARED_CONFIG } from '../../shared/shared.config';
import { Post } from '../post';
import { PostService } from '../post.service';
import { AuthService, DatePredicate, UtilService } from '@core';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.scss'],
  imports: [SHARED_CONFIG],
})
export class PostDetailComponent implements OnInit {
  post$: Observable<Post | undefined> | undefined;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public postService: PostService,
    public util: UtilService,
  ) {}

  toDate(d: DatePredicate): Date {
    if (typeof d === 'string') return new Date(d);
    if (typeof (d as any).toDate === 'function') return (d as any).toDate();
    return new Date((d as any).seconds * 1000);
  }

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const postId = params.get('postId') ?? '';
        return this.postService.one$(postId).pipe(
          tap((p) => {
            if (!p?.id) this.router.navigateByUrl('/blog');
          }),
        );
      }),
      shareReplay(1),
    );
  }
}
